'use client';

import { useAuth } from '@/context/AuthContext';
import { assets } from '@/public/assets';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const name = Cookies.get('name');
    const role = Cookies.get('role');

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="shadow py-4">
            <div className="px-4 2xl:px-20 mx-auto flex justify-between items-center">
                <Link href={'/'}>
                    <Image src={assets.logo} alt="logo" />
                </Link>
                {isLoggedIn ? (
                    <div className="flex items-center gap-3">
                        {role === 'recruiter' ? (
                            <Link href={'/dashboard'}>Recruiter Dashboard</Link>
                        ) : (
                            <Link href={'/applications'}>Applied Jobs</Link>
                        )}
                        <p>|</p>
                        <p className="max-sm:hidden">Hi, {name}</p>
                        <div className="size-8 rounded-full flex justify-center items-center text-white bg-violet-500 font-medium group relative">
                            R
                            <button
                                onClick={handleLogout}
                                className="hidden group-hover:block absolute top-full right-0 bg-slate-50 rounded-md shadow px-8 py-4 text-black cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 max-sm:text-xs">
                        <Link href={'/recruiter/sign-in'}>
                            <button className="text-gray-600 cursor-pointer">Recruiter Login</button>
                        </Link>
                        <Link href={'/sign-in'}>
                            <button className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full cursor-pointer">
                                Login
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
