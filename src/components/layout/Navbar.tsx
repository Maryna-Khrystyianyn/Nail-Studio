'use client'

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from 'next-intl'
import { useSession, signOut } from "next-auth/react"
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
    const { data: session } = useSession()
    const t = useTranslations('Navbar')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const switchLanguage = (newLocale: 'en' | 'de' | 'uk') => {
        router.push(pathname, { locale: newLocale })
        setIsMenuOpen(false)
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="bg-[#8d778b] backdrop-blur-md sticky top-0 z-50 border-b border-mauve-700 shadow-lg">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Burger Button - Visible on < lg */}
                    <button 
                        onClick={toggleMenu}
                        className="lg:hidden text-light-pink p-2 hover:bg-mauve-700 rounded-lg transition"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    <Link href="/" className="flex flex-col items-center group">
                        <span className="text-xl md:text-2xl font-serif text-light-pink tracking-widest border-2 border-light-pink px-2 py-1 group-hover:bg-light-pink group-hover:text-mauve-800 transition">
                            NAIL
                        </span>
                        <span className="text-[10px] md:text-xs text-light-pink tracking-[0.3em] mt-1 group-hover:text-white transition">STUDIO</span>
                    </Link>
                </div>

                {/* Desktop Navigation - Hidden on < lg */}
                <div className="hidden lg:flex gap-8 items-center uppercase  text-mauve-100/80">
                    <Link href="/gallery" className="hover:text-white transition">{t('gallery')}</Link>
                    <Link href="/services" className="hover:text-white transition">{t('prices')}</Link>
                    <Link href="/promotions" className="hover:text-white transition">{t('promotions')}</Link>
                    <Link href="/booking" className="hover:text-white transition">{t('booking')}</Link>

                    
                </div>

                {/* Always Visible Auth Area */}
                <div className="flex items-center">
                    {session ? (
                        <div className="flex gap-4 items-senter pl-4 md:pl-6 border-l border-mauve-700 ml-2">
                            <Link href={session.user?.role === 'ADMIN' ? "/admin" : "/dashboard"} className="text-light-pink hover:text-white ">
                                <span className="inline">{session.user?.name || t('profile')}</span>
                            </Link>
                            <button 
                                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                                className="mt-1 text-mauve-300 hover:text-white transition text-[10px] uppercase tracking-wider"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 md:gap-4 items-center pl-4 md:pl-6 border-l border-mauve-700 ml-2">
                            <Link href="/login" className="hover:text-white ">{t('login')}</Link>
                            <Link href="/register" className="bg-light-pink text-mauve-900 px-3 md:px-5 py-1.5 md:py-2 rounded-full font-serif italic font-bold text-sm hover:bg-white transition">
                                {t('register')}
                            </Link>
                        </div>
                    )}

                    {/* Desktop Language Switcher */}
                    <div className="lg:flex hidden gap-2 items-center ml-4 border-l border-mauve-700 pl-4">
                        <button 
                            onClick={() => switchLanguage('uk')} 
                            className={`hover:text-white transition ${locale === 'uk' ? 'text-light-pink font-bold' : ''}`}
                        >
                            UK
                        </button>
                        <span className="text-mauve-700">|</span>
                        <button 
                            onClick={() => switchLanguage('de')} 
                            className={`hover:text-white transition ${locale === 'de' ? 'text-light-pink font-bold' : ''}`}
                        >
                            DE
                        </button>
                        <span className="text-mauve-700">|</span>
                        <button 
                            onClick={() => switchLanguage('en')} 
                            className={`hover:text-white transition ${locale === 'en' ? 'text-light-pink font-bold' : ''}`}
                        >
                            EN
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Backdrop */}
            <div 
                className={`fixed inset-0  backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Drawer Content - Slide from Left */}
            <div 
                className={`fixed top-0 min-h-[500px] left-0 h-full w-[280px] bg-mauve-900/95 z-50 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
           
           >
                <div className="p-6  flex flex-col h-full">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-mauve-700">
                        <span className="text-2xl text-light-pink font-serif italic ">{t('studio')} </span>
                        <button onClick={() => setIsMenuOpen(false)} className="text-mauve-300 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex  flex-col gap-6 text-lg font-medium text-mauve-100/90">
                        <Link href="/gallery" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-light-pink transition">{t('gallery')}</Link>
                        <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-light-pink transition">{t('prices')}</Link>
                        <Link href="/promotions" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-light-pink transition">{t('promotions')}</Link>
                        <Link href="/booking" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-light-pink transition font-serif italic text-xl border-l-2 border-light-pink pl-4">{t('booking')}</Link>
                    </div>

                    <div className="mt-auto pt-10 border-t border-mauve-700">

                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => switchLanguage('uk')} 
                                className={`py-2 rounded border transition ${locale === 'uk' ? 'bg-light-pink text-mauve-900 border-light-pink' : 'border-mauve-700 text-pink-200'}`}
                            >
                                UK
                            </button>
                            <button 
                                onClick={() => switchLanguage('de')} 
                                className={`py-2 rounded border transition ${locale === 'de' ? 'bg-light-pink text-mauve-900 border-light-pink' : 'border-mauve-700 text-pink-200'}`}
                            >
                                DE
                            </button>
                            <button 
                                onClick={() => switchLanguage('en')} 
                                className={`py-2 rounded border transition ${locale === 'en' ? 'bg-light-pink text-mauve-900 border-light-pink' : 'border-mauve-700 text-pink-200'}`}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
