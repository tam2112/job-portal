'use client';

import { sidebarLinks } from '@/public/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="inline-block min-h-screen border-r-2 border-black/30">
            <ul className="flex flex-col items-start pt-5 text-gray-800">
                {sidebarLinks.map((link) => (
                    <li key={link.id} className="w-full">
                        <Link
                            href={link.path}
                            className={`flex items-center p-2 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                                pathname === link.path && 'bg-blue-100 border-r-4 border-blue-500'
                            }`}
                        >
                            <Image src={link.image} alt={link.label} className="min-w-4" />
                            <p className="max-sm:hidden">{link.label}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
