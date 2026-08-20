import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const TO = process.env.CONTACT_TO_EMAIL
const FROM = process.env.CONTACT_FROM_EMAIL
const API_KEY = process.env.RESEND_API_KEY
/** Zapier catch hook — receives every valid lead alongside the email. */
const ZAPIER_WEBHOOK_URL =
  process.env.ZAPIER_WEBHOOK_URL ?? 'https://hooks.zapier.com/hooks/catch/15212804/4tsgrbi/'

type Payload = {
  fullname?: unknown
  org?: unknown
  role?: unknown
  email?: unknown
  phone?: unknown
  participants?: unknown
  /** Full URL of the page the form was submitted from. */
  source?: unknown
  /** Honeypot — real users never fill this. */
  website?: unknown
}

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/**
 * Naive per-IP throttle. This is a single-page marketing site with one form, so
 * an in-process map is proportionate; it resets on redeploy, which is fine.
 */
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

/** Header injection guard: a newline in the reply-to would let a submitter add headers. */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: Payload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (str(body.website)) return NextResponse.json({ ok: true })

  const fullname = str(body.fullname, 120)
  const org = str(body.org, 120)
  const role = str(body.role, 120)
  const email = str(body.email, 160)
  const phone = str(body.phone, 40)
  const participants = str(body.participants, 20)
  // Prefer the URL the browser reported; fall back to the Referer header.
  const source = str(body.source, 2000) || str(req.headers.get('referer') ?? '', 2000)

  if (!fullname) {
    return NextResponse.json({ error: 'missing_name' }, { status: 400 })
  }
  if (email && !isEmail(email)) {
    return NextResponse.json({ error: 'bad_email' }, { status: 400 })
  }

  const rows: [string, string][] = [
    ['שם מלא', fullname],
    ['ארגון', org],
    ['תפקיד', role],
    ['אימייל', email],
    ['טלפון', phone],
    ['מספר משתתפים', participants],
  ].filter((r): r is [string, string] => Boolean(r[1]))

  const html = `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1B1A1F">
  <h2 style="margin:0 0 16px">פנייה חדשה מהאתר</h2>
  <table cellpadding="6" style="border-collapse:collapse">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="font-weight:700;white-space:nowrap">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`,
      )
      .join('')}
  </table>
</div>`

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')

  // Relay to Zapier and Resend in parallel. The lead is accepted if either
  // channel took it, so a hiccup on one side does not lose the submission.
  const [zapierOk, emailOk] = await Promise.all([
    sendToZapier({ fullname, org, role, email, phone, participants, source }),
    sendEmail({ fullname, email, html, text }),
  ])

  if (!zapierOk && !emailOk) {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}

async function sendToZapier(lead: Record<string, string>) {
  try {
    const res = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, submittedAt: new Date().toISOString() }),
    })
    if (!res.ok) console.error('Zapier webhook rejected the lead:', res.status)
    return res.ok
  } catch (err) {
    console.error('Zapier webhook threw:', err)
    return false
  }
}

async function sendEmail({
  fullname,
  email,
  html,
  text,
}: {
  fullname: string
  email: string
  html: string
  text: string
}) {
  if (!API_KEY || !TO || !FROM) {
    console.error('Email relay is not configured: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL')
    return false
  }
  try {
    const resend = new Resend(API_KEY)
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO.split(',').map((s) => s.trim()),
      subject: `פנייה חדשה מהאתר — ${fullname}`,
      html,
      text,
      ...(email ? { replyTo: email } : {}),
    })
    if (error) {
      console.error('Resend rejected the message:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Contact form send threw:', err)
    return false
  }
}
