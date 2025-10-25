import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { JobProvider } from '@/context/JobContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: 'Job Portal 💼',
    description:
        "InsiderJobs is a modern job portal designed to connect top talent with leading companies. Whether you're a job seeker looking for your next big opportunity or an employer searching for skilled professionals, JobLink makes the hiring process fast, smart, and effortless",
    openGraph: {
        title: 'Job Portal 💼',
        description:
            "InsiderJobs is a modern job portal designed to connect top talent with leading companies. Whether you're a job seeker looking for your next big opportunity or an employer searching for skilled professionals, JobLink makes the hiring process fast, smart, and effortless",
        images: [
            {
                url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
                width: 1170,
                height: 1088,
                alt: 'Alt',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <JobProvider>
                <html lang="en" suppressHydrationWarning>
                    <body className={`${outfit.variable} font-outfit antialiased`}>
                        <Toaster />
                        {children}
                    </body>
                </html>
            </JobProvider>
        </AuthProvider>
    );
}
