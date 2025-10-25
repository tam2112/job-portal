'use client';

import { updateApplicationStatus } from '@/lib/actions/apply.action';
import { assets } from '@/public/assets';
import { useJobApplyStore } from '@/store/applyStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ViewApplications() {
    const { applicationsByCompany, fetchApplicationsByCompany } = useJobApplyStore();

    useEffect(() => {
        fetchApplicationsByCompany();
    }, [fetchApplicationsByCompany]);

    const handleAccept = async (id: string) => {
        const result = await updateApplicationStatus(id, 'Accepted');
        if (result.success) {
            toast.success('Application accepted!');
            fetchApplicationsByCompany();
        } else {
            toast.error(result.message || 'Failed to accept application');
        }
    };

    const handleReject = async (id: string) => {
        const result = await updateApplicationStatus(id, 'Rejected');
        if (result.success) {
            toast.success('Application rejected!');
            fetchApplicationsByCompany();
        } else {
            toast.error(result.message || 'Failed to reject application');
        }
    };

    return (
        <div className="mx-auto p-4 w-full">
            <div>
                <table className="w-full sm:min-w-7xl bg-white border border-gray-200 max-sm:text-sm">
                    <thead>
                        <tr className="border-b border-black/30">
                            <th className="py-2 px-4 text-left">#</th>
                            <th className="py-2 px-4 text-left">User name</th>
                            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
                            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                            <th className="py-2 px-4 text-left">Resume</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicationsByCompany?.map((item, index) => (
                            <tr key={item.id}>
                                <td className="py-2 px-4 border-b border-black/30 text-center">{index + 1}</td>
                                <td className="py-2 px-4 border-b border-black/30 text-center">
                                    <div className="flex items-center gap-2">
                                        {item.user.images.length > 0 ? (
                                            <Image
                                                src={item.user.images ? item.user.images[0]?.url : assets.profile_img}
                                                alt="image"
                                                className="size-10 rounded-full mr-3 max-sm:hidden"
                                            />
                                        ) : (
                                            <Image
                                                src={assets.profile_img}
                                                alt="image"
                                                className="size-10 rounded-full mr-3 max-sm:hidden"
                                            />
                                        )}
                                        <span>{item.user.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">{item.job.title}</td>
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">
                                    {item.job.location}
                                </td>
                                <td className="py-2 px-4 border-b border-black/30">
                                    {item.user.files.length > 0 ? (
                                        <Link
                                            href={item.user.files ? item.user.files[0].url : ''}
                                            target="_blank"
                                            className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                                        >
                                            Resume <Image src={assets.resume_download_icon} alt="resume" />
                                        </Link>
                                    ) : (
                                        <p>No resume</p>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-black/30 relative">
                                    {item.status.name === 'Accepted' ? (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Accepted</span>
                                    ) : item.status.name === 'Rejected' ? (
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded">Rejected</span>
                                    ) : (
                                        <div className="relative inline-block text-left group">
                                            <button className="text-gray-500 action-button">...</button>
                                            <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                                                <button
                                                    onClick={() => handleAccept(item.id)}
                                                    className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.id)}
                                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
