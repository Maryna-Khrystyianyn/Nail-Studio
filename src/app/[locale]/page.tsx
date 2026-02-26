import { Link } from "@/i18n/routing"
import { Slideshow } from '@/components/layout/Slideshow'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')

  return (
    <div className="min-h-screen pb-16 relative overflow-hidden">
      {/* Decorative leafy elements (CSS simulations) */}
      <div className="absolute top-0 left-0 w-64 h-64 border border-mauve-800/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 border-2 border-white/20 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Hero / Poster Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="bg-mauve-800 rounded-sm shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col md:flex-row">

          {/* Decorative Lines/Leaves overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%)' }}></div>

          {/* Left Image Section - SLIDESHOW */}
          <div className="md:w-1/2 relative p-8 md:p-12 flex items-center justify-center">
            <div className="relative z-10 w-full aspect-[4/5] md:aspect-square max-w-md">
              <div className="absolute inset-4 bg-white md:-inset-2 transform -rotate-2"></div>
              <div className="absolute inset-0 shadow-lg transform">
                <Slideshow />
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center text-right md:text-right relative z-20">
            <div className="bg-light-pink text-mauve-900 inline-block px-4 py-2 mb-6 self-end font-serif tracking-widest text-sm uppercase font-bold border border-mauve-900/10">
              {t('studio')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-light-pink leading-tight mb-8">
              {t('heroTitle')} <br />
              <span className="text-white">{t('heroSubtitle')}</span>
            </h1>

            <div className="text-mauve-200 font-light text-sm md:text-base leading-relaxed mb-8 max-w-md ml-auto">
              <h3 className="text-xl font-serif text-white mb-2 uppercase tracking-widest">
                <p>{t('weCare1')}</p>
                <p>{t('weCare2')}</p></h3>
              <p>
                {t('heroDescription')}
              </p>
            </div>

            <div className="flex justify-end">
              <Link href="/services" className="btn-primary">
                {t('viewOffers')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/booking" className="bg-white p-8 border border-mauve-800/20 hover:border-mauve-800 transition group cursor-pointer shadow-sm">
            <h3 className="font-serif text-2xl text-mauve-900 mb-2 group-hover:text-mauve-700">{t('manicure')}</h3>
            <p className="text-mauve-700/70 text-sm">{t('manicureDesc')}</p>
          </Link>
          <Link href="/booking" className="bg-mauve-800 p-8 border border-mauve-800 hover:bg-mauve-900 transition group cursor-pointer shadow-xl transform md:-translate-y-4">
            <h3 className="font-serif text-2xl text-light-pink mb-2">{t('bookNow')}</h3>
            <p className="text-mauve-200/70 text-sm">{t('bookNowDesc')}</p>
          </Link>
          <Link href="/gallery" className="bg-white p-8 border border-mauve-800/20 hover:border-mauve-800 transition group cursor-pointer shadow-sm">
            <h3 className="font-serif text-2xl text-mauve-900 mb-2 group-hover:text-mauve-700">{t('gallery')}</h3>
            <p className="text-mauve-700/70 text-sm">{t('galleryDesc')}</p>
          </Link>
        </div>
      </section>

      {/* Additional Info / Testimonials */}
      <section className="container mx-auto px-4 text-center py-16">
        <h2 className="text-3xl font-serif text-mauve-900 mb-12 relative inline-block">
          <span className="relative z-10 px-4 bg-dusty-pink">{t('philosophy')}</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-mauve-900/20 -z-0"></div>
        </h2>

        <div className="max-w-2xl mx-auto">
          <p className="text-lg italic font-serif text-mauve-800 leading-loose">
            "{t('philosophyText')}"
          </p>
        </div>
      </section>
    </div>
  );
}
