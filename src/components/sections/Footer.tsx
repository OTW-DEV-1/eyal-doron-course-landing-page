import { asset } from '@/lib/assets'

export function Footer() {
  return (
    <footer className="flex justify-center px-7 py-16">
      <img src={asset('logo-black.png')} alt="dr. eyal doron" className="block h-14" />
    </footer>
  )
}
