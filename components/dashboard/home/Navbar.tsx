'use client';

import { assets } from '@/public/assets';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/companyStore';
import { useEffect } from 'react';

export default function Navbar() {
    const name = Cookies.get('name');
    const { logout } = useAuth();
    const router = useRouter();

    const { company, fetchCompany } = useCompanyStore();

    useEffect(() => {
        fetchCompany();
    }, [fetchCompany]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="shadow py-4">
            <div className="px-5 flex justify-between items-center">
                <Link href={'/dashboard'}>
                    <Image src={assets.logo} alt="logo" className="max-sm:w-32 cursor-pointer" />
                </Link>
                <div className="flex items-center gap-3">
                    <p className="max-sm:hidden">Welcome, {name}</p>
                    <div className="relative group">
                        <Image
                            src={company?.images ? company.images[0].url : assets.company_icon}
                            alt="company icon"
                            width={32}
                            height={32}
                            className="w-8 border"
                        />
                        <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                            <ul className="list-none m-0 p-2 bg-white rounded-md border border-black/30 text-sm">
                                <li className="py-1 px-2 cursor-pointer pr-10" onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
