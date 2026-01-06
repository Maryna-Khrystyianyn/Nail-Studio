import Link from "next/link"
import { auth, signOut } from "@/auth"

export async function Navbar() {
    const session = await auth()

    return (
        <nav className="bg-mauve-800/95 backdrop-blur-md sticky top-0 z-50 border-b border-mauve-700 shadow-lg">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex flex-col items-center group">
                    <span className="text-2xl font-serif text-light-pink tracking-widest border-2 border-light-pink px-2 py-1 group-hover:bg-light-pink group-hover:text-mauve-800 transition">
                        NAIL
                    </span>
                    <span className="text-xs text-light-pink tracking-[0.3em] mt-1 group-hover:text-white transition">STUDIO</span>
                </Link>

                <div className="flex gap-8 items-center text-sm font-medium text-mauve-100/80">
                    <Link href="/gallery" className="hover:text-white transition">Galerie</Link>
                    <Link href="/services" className="hover:text-white transition">Preise</Link>
                    <Link href="/promotions" className="hover:text-white transition">Angebote</Link>
                    <Link href="/booking" className="hover:text-white transition">Termin buchen</Link>

                    {session ? (
                        <div className="flex gap-4 items-center pl-6 border-l border-mauve-700 ml-2">
                            <Link href={session.user?.role === 'ADMIN' ? "/admin" : "/dashboard"} className="text-light-pink hover:text-white">
                                {session.user?.name || 'Mein Profil'}
                            </Link>
                            <form action={async () => {
                                'use server'
                                await signOut()
                            }}>
                                <button className="text-mauve-300 hover:text-white transition text-xs uppercase tracking-wider">Abmelden</button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center pl-6 border-l border-mauve-700 ml-2">
                            <Link href="/login" className="hover:text-white">Anmelden</Link>
                            <Link href="/register" className="bg-light-pink text-mauve-900 px-5 py-2 rounded-full font-serif italic font-bold hover:bg-white transition">Registrieren</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
