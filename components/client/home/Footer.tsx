import { assets } from '@/public/assets';
import Image from 'next/image';

export default function Footer() {
    return (
        <div className="px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20">
            <Image src={assets.logo} alt="logo" />
            <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
                Copyright &copy; 2025 | All Rights Reserved.
            </p>
            <div className="flex gap-2.5">
                <Image src={assets.facebook_icon} alt="" width={38} />
                <Image src={assets.twitter_icon} alt="" width={38} />
                <Image src={assets.instagram_icon} alt="" width={38} />
            </div>
        </div>
    );
}
