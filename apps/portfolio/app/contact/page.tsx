import { ContactForm } from '@/components/contact-form';

export const metadata = {
    title: 'Contact | Kache Digital',
    description: 'Initiate a digital handshake for your next high-impact project.',
};

export default function ContactPage() {
    return (
        <main className="container mx-auto px-4 py-32 min-h-screen">
            <div className="mx-auto max-w-2xl">
                <div className="mb-16 text-center">
                    <h1 className="mb-6 text-5xl font-black tracking-tighter md:text-7xl">
                        Let&apos;s Build.
                    </h1>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed">
                        Ready to deploy high-signal solutions? Send over your project parameters
                        and we&apos;ll initiate the architectural review.
                    </p>
                </div>

                <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-12 pb-32 md:pb-12">
                    <ContactForm />
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 text-center">
                        <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-gray-500">Fast Lane</h3>
                        <p className="text-sm font-bold text-white">hq@kache.digital</p>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 text-center">
                        <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-gray-500">Secure Comms</h3>
                        <p className="text-sm font-bold text-white">@kachedigital</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
