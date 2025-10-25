'use client';

import { jobSchema, JobSchema } from '@/lib/validation/job.form';
import { jobCategories, jobLocations } from '@/public/assets';
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { createJob } from '@/lib/actions/job.action';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function AddJob() {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    const companyId = Cookies.get('userId') || '';

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<JobSchema>({
        resolver: zodResolver(jobSchema()),
        defaultValues: {
            date: Date.now(),
            companyId,
            visible: false,
        },
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [state, formAction] = useFormState(createJob, {
        success: false,
        error: false,
    });

    useEffect(() => {
        // Initial Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            });

            // Set up text-change listener for description
            quillRef.current.on('text-change', () => {
                if (quillRef.current) {
                    setValue('description', quillRef.current.root.innerHTML, { shouldValidate: true });
                }
            });
        }
    }, [setValue]);

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const dataWithImageAndFileUrls = { ...formData };
        formAction(dataWithImageAndFileUrls);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Create job successfully!!');
            router.refresh();

            reset();
            if (quillRef.current) {
                quillRef.current.setText('');
            }
            setHasSubmitted(false);
        } else if (state.error) {
            toast.error(state.message || 'Create failed');
        }
    }, [state, router, hasSubmitted, reset]);

    return (
        <form method="POST" onSubmit={onSubmit} className="p-4 flex flex-col w-full items-start gap-3">
            {/* title */}
            <div className="w-full">
                <p className="mb-2">Job Title</p>
                <input
                    type="text"
                    {...register('title')}
                    placeholder="Type here"
                    className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                />
                {errors.title?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.title?.message.toString()}</p>
                )}
            </div>
            {/* description */}
            <div className="w-full max-w-lg">
                <p className="my-2">Job Description</p>
                <div ref={editorRef}></div>
                {errors.description?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.description?.message.toString()}</p>
                )}
            </div>
            {/* category | location | level */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                {/* category */}
                <div>
                    <p className="mb-2">Job Category</p>
                    <select {...register('category')} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
                        {jobCategories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.category?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.category?.message.toString()}</p>
                    )}
                </div>
                {/* location */}
                <div>
                    <p className="mb-2">Job Location</p>
                    <select {...register('location')} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
                        {jobLocations.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.location?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.location?.message.toString()}</p>
                    )}
                </div>
                {/* level */}
                <div>
                    <p className="mb-2">Job Level</p>
                    <select {...register('level')} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                    {errors.level?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.level?.message.toString()}</p>
                    )}
                </div>
            </div>
            {/* salary */}
            <div>
                <p className="mb-2">Job Salary</p>
                <input
                    type="number"
                    {...register('salary')}
                    placeholder="2500"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
                />
                {errors.salary?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.salary?.message.toString()}</p>
                )}
            </div>
            {/* button */}
            <button className="w-28 py-3 mt-4 bg-black text-white rounded cursor-pointer">ADD</button>
        </form>
    );
}
