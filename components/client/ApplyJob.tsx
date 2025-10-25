'use client';

import { assets } from '@/public/assets';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Loader from './helper/Loader';
import moment from 'moment';
import JobCard from './helper/JobCard';
import { useJobStore } from '@/store/jobStore';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { applyJob, checkIfApplied } from '@/lib/actions/apply.action';
import { useRouter } from 'next/navigation';

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

export default function ApplyJob({ job }: { job: JobType | null }) {
    const role = Cookies.get('role');

    const { jobs, fetchJobs } = useJobStore();
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
        const checkApplication = async () => {
            if (job) {
                const userId = Cookies.get('userId');
                if (userId) {
                    const applied = await checkIfApplied(userId, job.id, job.company.id);
                    setIsApplied(applied);
                }
                setLoading(false);
            }
        };

        checkApplication();
    }, [job]);

    const router = useRouter();

    const handleApplyJob = async () => {
        if (isApplied) {
            return;
        }

        if (role === 'recruiter') {
            toast.error('Recruiters cannot apply for jobs.');
            return;
        }

        const userId = Cookies.get('userId');
        console.log(userId);

        if (!userId) {
            toast.error('User not authenticated. Please log in to apply this job.');
            return;
        }

        const result = await applyJob(userId, job!.id, job!.company.id);

        if (result.success) {
            toast.success('Apply job successfully!');
            router.push('/applications');
        } else {
            toast.error(result.message || 'Failed to apply job');
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
        );

    return job ? (
        <>
            <div className="min-h-screen flex flex-col py-10 px-4 2xl:px-20 mx-auto">
                <div className="bg-white text-black rounded-lg w-full">
                    <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
                        {/* image company, title, location, name company, level, salary */}
                        <div className="flex flex-col md:flex-row items-center">
                            <Image
                                src={job.company.images ? job.company.images[0].url : assets.company_icon}
                                alt="company icon"
                                width={96}
                                height={96}
                                className="h-24 w-24 object-contain bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                            />
                            <div className="text-center md:text-left text-neutral-700">
                                <h1 className="text-2xl sm:text-4xl font-medium">{job.title}</h1>
                                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                                    <span className="flex items-center gap-1">
                                        <Image src={assets.suitcase_icon} alt="suitcase" />
                                        {job.company.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Image src={assets.location_icon} alt="location" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Image src={assets.person_icon} alt="person" />
                                        {job.level}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Image src={assets.money_icon} alt="money" />
                                        CTC: {job.salary}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* button apply */}
                        <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
                            <button
                                onClick={handleApplyJob}
                                disabled={isApplied}
                                className={`p-2.5 px-10 text-white rounded ${
                                    isApplied
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                }`}
                            >
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </button>
                            <p className="mt-1 text-gray-600">Posted {moment(Number(job.date)).fromNow()}</p>
                        </div>
                    </div>
                    {/* job description */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                        <div className="w-full lg:w-2/3">
                            <h2 className="font-bold text-2xl mb-4">Job description</h2>
                            <div className="rich-text" dangerouslySetInnerHTML={{ __html: job.description }}></div>
                            <button
                                onClick={handleApplyJob}
                                disabled={isApplied}
                                className={`p-2.5 px-10 text-white rounded mt-10 ${
                                    isApplied
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                }`}
                            >
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </button>
                        </div>
                        {/* more jobs */}
                        <div className="w-full lg:w-1/3 mt-8 lg:mt-0 space-y-5">
                            <h2>More jobs from {job.company.name}</h2>
                            {jobs &&
                                jobs
                                    .filter((j) => j.id !== job.id && j.company.id === job.company.id)
                                    .filter((j) => j)
                                    .slice(0, 4)
                                    .map((item) => <JobCard key={item.id} job={item} />)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <Loader />
    );
}
