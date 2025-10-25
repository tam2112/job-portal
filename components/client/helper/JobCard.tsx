'use client';

import { assets } from '@/public/assets';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { applyJob, checkIfApplied } from '@/lib/actions/apply.action';
import toast from 'react-hot-toast';

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

export default function JobCard({ job }: { job: JobType }) {
    const role = Cookies.get('role');

    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

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
        } else {
            toast.error(result.message || 'Failed to apply job');
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="border border-black/30 p-6 shadow rounded">
            <div className="flex justify-between items-center">
                <Image
                    src={job.company.images ? job.company.images[0].url : assets.company_icon}
                    width={32}
                    height={32}
                    alt=""
                    className="h-8 object-contain"
                />
            </div>
            <h4 className="font-medium text-xl mt-2">{job.title}</h4>
            <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">{job.location}</span>
                <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">{job.level}</span>
            </div>
            <p className="text-gray-500 text-sm mt-4">{job.description.replace(/<[^>]+>/g, '').slice(0, 150)}...</p>
            <div className="mt-4 flex gap-4 text-sm">
                <Link
                    href={`/apply-job/${job.id}`}
                    onClick={handleApplyJob}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Link>
                <Link href={`/apply-job/${job.id}`} className="text-gray-500 border border-gray-500 rounded px-4 py-2">
                    Learn More
                </Link>
            </div>
        </div>
    );
}
