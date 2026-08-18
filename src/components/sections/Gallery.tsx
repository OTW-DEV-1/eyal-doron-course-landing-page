import { DomeGallery } from '@/components/reactbits/DomeGallery'
import { galleryImages } from '@/lib/content'

/** Course photos wrapped onto a slowly rotating, draggable sphere. */
export function Gallery() {
  return (
    <section id="gallery" className="relative pb-5">
      <div className="relative mt-0 h-[74vh] min-h-[580px]">
        <DomeGallery
          images={[...galleryImages]}
          fit={0.75}
          minRadius={480}
          segments={14}
          dragDampening={1.8}
          autoRotate={6}
          grayscale={false}
          overlayBlurColor="#F6F5F2"
        />
      </div>
    </section>
  )
}
