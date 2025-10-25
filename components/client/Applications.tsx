'use client';

import { assets } from '@/public/assets';
import { useJobApplyStore } from '@/store/applyStore';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getUserResume, uploadUserFile } from '@/lib/actions/user.action';
import toast from 'react-hot-toast';
import { uploadFilesToCloudinary } from '@/lib/upload';

export default function Applications() {
    const { applicationsByUser, fetchApplicationsByUser } = useJobApplyStore();

    useEffect(() => {
        fetchApplicationsByUser();
    }, [fetchApplicationsByUser]);

    const [isEdit, setIsEdit] = useState(false);
    const [resume, setResume] = useState<File | null>(null);
    const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);

    const userId = Cookies.get('userId');

    useEffect(() => {
        const initResume = async () => {
            if (userId) {
                const resumeFile = await getUserResume(userId);
                setCurrentResumeUrl(resumeFile?.url || null);
            }
        };
        initResume();
    }, [userId]);

    const handleSaveResume = async () => {
        if (!resume || !userId) {
            toast.error('Please select a file and ensure you are logged in.');
            return;
        }

        if (resume.type !== 'application/pdf') {
            toast.error('Please select a PDF file.');
            return;
        }

        try {
            const urls = await uploadFilesToCloudinary([resume]);
            const url = urls[0];

            const result = await uploadUserFile(userId, url);

            if (result.success) {
                toast.success('Resume uploaded successfully!');
                setCurrentResumeUrl(url);
                setIsEdit(false);
                setResume(null);
            } else {
                toast.error(result.message || 'Failed to save resume.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload resume.');
        }
    };

    return (
        <div className="px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
            <h2 className="text-xl font-semibold">Your Resume</h2>
            <div className="flex gap-2 mb-6 mt-3">
                {isEdit ? (
                    <>
                        <label htmlFor="resumeUpload" className="flex items-center gap-2">
                            {resume ? (
                                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">
                                    Selected: {resume.name}
                                </p>
                            ) : (
                                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 cursor-pointer">
                                    Select Resume
                                </p>
                            )}
                            <input
                                id="resumeUpload"
                                onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
                                type="file"
                                hidden
                                accept="application/pdf"
                            />
                            {!resume && (
                                <Image src={assets.profile_upload_icon} alt="upload" className="cursor-pointer" />
                            )}
                        </label>
                        <button
                            onClick={handleSaveResume}
                            className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 cursor-pointer"
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        {currentResumeUrl ? (
                            <Link
                                href={currentResumeUrl}
                                target="_blank"
                                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                            >
                                Resume
                            </Link>
                        ) : (
                            <p className="bg-blue-100 text-blue-600 p-2 px-4 rounded-lg">No resume uploaded</p>
                        )}
                        <button
                            onClick={() => setIsEdit(true)}
                            className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
            {/* job list */}
            <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
            <table className="min-w-full bg-white border border-black/30 rounded-lg">
                <thead>
                    <tr>
                        <th className="py-3 px-4 border-b border-black/30 text-left">Company</th>
                        <th className="py-3 px-4 border-b border-black/30 text-left">Job Title</th>
                        <th className="py-3 px-4 border-b border-black/30 text-left max-sm:hidden">Location</th>
                        <th className="py-3 px-4 border-b border-black/30 text-left max-sm:hidden">Date</th>
                        <th className="py-3 px-4 border-b border-black/30 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {applicationsByUser?.map((item) =>
                        item ? (
                            <tr key={item.id}>
                                <td className="py-3 px-4 flex items-center gap-2 border-b border-black/30">
                                    <Image
                                        src={item.company.images ? item.company.images[0].url : assets.company_icon}
                                        alt="logo"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 object-contain"
                                    />
                                    {item.company.name}
                                </td>
                                <td className="py-2 px-4 border-b border-black/30">{item.job.title}</td>
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">
                                    {item.job.location}
                                </td>
                                <td className="py-2 px-4 border-b border-black/30 max-sm:hidden">
                                    {moment(Number(item.job.date)).format('ll')}
                                </td>
                                <td className="py-2 px-4 border-b border-black/30">
                                    <span
                                        className={`${
                                            item.status.name === 'Accepted'
                                                ? 'bg-green-100'
                                                : item.status.name == 'Rejected'
                                                ? 'bg-red-100'
                                                : 'bg-blue-100'
                                        } px-4 py-1.5 rounded`}
                                    >
                                        {item.status.name}
                                    </span>
                                </td>
                            </tr>
                        ) : null,
                    )}
                </tbody>
            </table>
        </div>
    );
}
