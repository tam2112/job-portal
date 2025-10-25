'use client';

import { useJob } from '@/context/JobContext';
import { assets, jobCategories, jobLocations } from '@/public/assets';
import Image from 'next/image';
import JobCard from '../helper/JobCard';
import { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useJobStore } from '@/store/jobStore';

type JobType = {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    level: string;
    salary: number;
    date: bigint;
    visible: boolean;
    company: { id: string; name: string; images: { url: string }[] };
};

export default function JobList() {
    const { jobs, fetchJobs } = useJobStore();

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const { isSearched, searchFilter, setSearchFilter } = useJob();

    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

    const [filteredJobs, setFilteredJobs] = useState(jobs);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        );
    };

    const handleLocationChange = (location: string) => {
        setSelectedLocations((prev) =>
            prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location],
        );
    };

    useEffect(() => {
        const matchesCategory = (job: JobType) =>
            selectedCategories.length === 0 || selectedCategories.includes(job.category);
        const matchesLocation = (job: JobType) =>
            selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const matchesTitle = (job: JobType) =>
            searchFilter.title === '' || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
        const matchesSearchLocation = (job: JobType) =>
            searchFilter.location === '' || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

        if (jobs) {
            const newFilteredJobs = jobs
                .slice()
                .reverse()
                .filter(
                    (job) =>
                        matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job),
                );

            setFilteredJobs(newFilteredJobs);
            setCurrentPage(1);
        }
    }, [selectedCategories, selectedLocations, searchFilter, jobs]);

    return (
        <div className="2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
            {/* sidebar */}
            <div className="w-full lg:w-1/4 bg-white px-4">
                {/* search filter */}
                {isSearched && (searchFilter.title !== '' || searchFilter.location !== '') && (
                    <>
                        <h3 className="font-medium text-lg mb-4">Current Search</h3>
                        <div className="mb-4 text-gray-600">
                            {searchFilter.title && (
                                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                                    {searchFilter.title}{' '}
                                    <Image
                                        onClick={() => setSearchFilter((prev) => ({ ...prev, title: '' }))}
                                        src={assets.cross_icon}
                                        alt="cross"
                                        className="cursor-pointer"
                                    />
                                </span>
                            )}
                            {searchFilter.location && (
                                <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                                    {searchFilter.location}{' '}
                                    <Image
                                        onClick={() => setSearchFilter((prev) => ({ ...prev, location: '' }))}
                                        src={assets.cross_icon}
                                        alt="cross"
                                        className="cursor-pointer"
                                    />
                                </span>
                            )}
                        </div>
                    </>
                )}
                <button
                    onClick={() => setShowFilter((prev) => !prev)}
                    className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
                >
                    {showFilter ? 'Close' : 'Filters'}
                </button>
                {/* category filter */}
                <div className={showFilter ? '' : 'max-lg:hidden'}>
                    <h4 className="font-medium text-lg py-4">Search by Categories</h4>
                    <ul className="space-y-4 text-gray-600">
                        {jobCategories.map((item) => (
                            <li key={item} className="flex gap-3 items-center">
                                <input
                                    type="checkbox"
                                    onChange={() => handleCategoryChange(item)}
                                    checked={selectedCategories.includes(item)}
                                    className="scale-125 accent-blue-600"
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Location filter */}
                <div className={showFilter ? '' : 'max-lg:hidden'}>
                    <h4 className="font-medium text-lg py-4 pt-14">Search by Locations</h4>
                    <ul className="space-y-4 text-gray-600">
                        {jobLocations.map((item) => (
                            <li key={item} className="flex gap-3 items-center">
                                <input
                                    type="checkbox"
                                    onChange={() => handleLocationChange(item)}
                                    checked={selectedLocations.includes(item)}
                                    className="scale-125 accent-blue-600"
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* job list */}
            <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
                <h3 className="font-medium text-3xl py-2" id="job-list">
                    Latest jobs
                </h3>
                <p className="mb-8">Get your desired job from top companies</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredJobs?.slice((currentPage - 1) * 6, currentPage * 6).map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
                {/* pagination */}
                {filteredJobs && filteredJobs.length > 0 && (
                    <div className="flex items-center justify-center space-x-2 mt-10">
                        <ScrollLink to={'/job-list'}>
                            <Image
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                src={assets.left_arrow_icon}
                                alt="left arrow"
                            />
                        </ScrollLink>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <ScrollLink key={index} to={'job-list'}>
                                <button
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded cursor-pointer ${
                                        currentPage == index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            </ScrollLink>
                        ))}
                        <ScrollLink to={'job-list'}>
                            <Image
                                onClick={() =>
                                    setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))
                                }
                                src={assets.right_arrow_icon}
                                alt="right arrow"
                            />
                        </ScrollLink>
                    </div>
                )}
            </section>
        </div>
    );
}
