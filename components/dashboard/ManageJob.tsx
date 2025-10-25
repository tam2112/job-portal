'use client';

import { updateJobVisibility } from '@/lib/actions/job.action';
import { useJobStore } from '@/store/jobStore';
import moment from 'moment';
import Link from 'next/link';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ManageJob() {
    const { jobsByCompany, fetchJobsByCompany } = useJobStore();

    useEffect(() => {
        fetchJobsByCompany();
    }, [fetchJobsByCompany]);

    const handleVisibilityChange = async (jobId: string, visible: boolean) => {
        const result = await updateJobVisibility(jobId, visible);
        if (result.success) {
            toast.success('Update visibility successfully!');
            fetchJobsByCompany();
        } else {
            toast.error(result.message || 'Failed to update visibility');
        }
    };

    return (
        <div className="p-4 max-w-5xl">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-black/30 text-left max-sm:hidden">#</th>
                            <th className="py-2 px-4 border-b border-black/30 text-left">Job Title</th>
                            <th className="py-2 px-4 border-b border-black/30 text-left max-sm:hidden">Date</th>
                            <th className="py-2 px-4 border-b border-black/30 text-left max-sm:hidden">Location</th>
                            <th className="py-2 px-4 border-b border-black/30 text-center">Applicants</th>
                            <th className="py-2 px-4 border-b border-black/30 text-left">Visible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobsByCompany?.map((item, index) => (
                            <tr key={item.id} className="text-gray-700">
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">{index + 1}</td>
                                <td className="py-2 px-4 border-b border-black/30">{item.title}</td>
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">
                                    {moment(Number(item.date)).format('ll')}
                                </td>
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">{item.location}</td>
                                <td className="py-2 px-4 border-b border-black/30 text-center">20</td>
                                <td className="py-2 px-4 border-b border-black/30">
                                    <input
                                        type="checkbox"
                                        checked={item.visible}
                                        onChange={(e) => handleVisibilityChange(item.id, e.target.checked)}
                                        className="accent-blue-600 scale-125 ml-4 cursor-pointer mt-1.5"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-end">
                <Link href={'/dashboard/add-job'}>
                    <button className="bg-black text-white py-2 px-4 rounded cursor-pointer">Add new job</button>
                </Link>
            </div>
        </div>
    );
}
