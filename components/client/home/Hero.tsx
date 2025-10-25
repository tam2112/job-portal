'use client';

import { useJob } from '@/context/JobContext';
import { assets } from '@/public/assets';
import Image from 'next/image';
import { useRef } from 'react';

export default function Hero() {
    const { setSearchFilter, setIsSearched } = useJob();

    const titleRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    const onSearch = () => {
        if (!titleRef.current || !locationRef.current) return;
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value,
        });
        setIsSearched(true);
    };

    return (
        <div className="2xl:px-20 mx-auto my-10">
            {/* content */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl">
                {/* text */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">Over 10,000+ jobs to apply</h2>
                <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
                    Your Next Big Career Move Starts Right Here - Explore The Best Job Opportunities And Take The First
                    Step Forward Your Future.
                </p>
                {/* search */}
                <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl mx-4 sm:mx-auto">
                    <div className="flex items-center ml-3">
                        <Image src={assets.search_icon} alt="search" className="h-4 sm:h-5" />
                        <input
                            type="text"
                            ref={titleRef}
                            placeholder="Search for jobs"
                            className="max-sm:text-xs p-2 rounded outline-none w-full"
                        />
                    </div>
                    <div className="flex items-center">
                        <Image src={assets.location_icon} alt="location" className="h-4 sm:h-5" />
                        <input
                            type="text"
                            ref={locationRef}
                            placeholder="Location"
                            className="max-sm:text-xs p-2 rounded outline-none w-full"
                        />
                    </div>
                    <button onClick={onSearch} className="bg-blue-600 px-6 py-2 rounded text-white m-1 cursor-pointer">
                        Search
                    </button>
                </div>
            </div>
            {/* sponsor */}
            <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex">
                <div className="flex justify-center items-center gap-10 lg:gap-16 flex-wrap">
                    <p className="font-medium">Trusted by</p>
                    <Image src={assets.microsoft_logo} alt="" className="object-contain w-32 h-6" />
                    <Image src={assets.walmart_logo} alt="" className="object-contain w-32 h-6" />
                    <Image src={assets.accenture_logo} alt="" className="object-contain w-32 h-6" />
                    <Image src={assets.samsung_logo} alt="" className="object-contain w-32 h-6" />
                    <Image src={assets.amazon_logo} alt="" className="object-contain w-32 h-6" />
                    <Image src={assets.adobe_logo} alt="" className="object-contain w-32 h-6" />
                </div>
            </div>
        </div>
    );
}
