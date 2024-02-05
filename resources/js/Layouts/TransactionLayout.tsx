import { PropsWithChildren } from 'react'
import { Head } from '@inertiajs/react'

export default function TransactionLayout({title, bgColor = 'bg-slate-200', children}: PropsWithChildren<{ 
    title:string,
    bgColor?:string
}>) {
    return(
        <>
            <Head title={title} />
            <section className={`min-h-dvh ${bgColor} w-full flex flex-col justify-between`}>
                <main className="max-w-8xl min-h-80 bg-white shadow-sm shadow-indigo-500/40 mx-4 my-4 rounded-lg px-4 py-4 mb-auto">
                    {children}
                </main>
                <footer className="bg-white p-5">
                    <p className="text-center font-medium">
                        &copy; Copyright Jupiter IT Solutions - {new Date().getFullYear()}
                    </p>
                </footer>
            </section>
        </>
    )
}