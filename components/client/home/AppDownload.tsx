import { assets } from '@/public/assets';
import Image from 'next/image';
import Link from 'next/link';

export default function AppDownload() {
    return (
        <div className="px-4 2xl:px-20 mx-auto my-20">
            <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 p-12 sm:p-24 lg:p-32 rounded-lg">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-bold mb-8 max-w-md">
                        Download Mobile App For Better Experience
                    </h1>
                    <div className="flex gap-4">
                        <Link href={'/'} className="inline-block">
                            <Image src={assets.play_store} alt="play store" className="h-12" />
                        </Link>
                        <Link href={'/'} className="inline-block">
                            <Image src={assets.app_store} alt="app store" className="h-12" />
                        </Link>
                    </div>
                </div>
                <Image
                    src={assets.app_main_img}
                    alt="app main img"
                    className="absolute w-80 right-0 bottom-0 mr-32 max-lg:hidden"
                />
            </div>
        </div>
    );
}
