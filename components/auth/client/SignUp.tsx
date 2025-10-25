'use client';

import { assets } from '@/public/assets';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { signUpUser } from '@/lib/actions/user.action';
import toast from 'react-hot-toast';
import { signUpSchema, SignUpSchema } from '@/lib/validation/user.form';
import Link from 'next/link';

export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema()),
    });

    const router = useRouter();

    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    const [state, formAction] = useFormState(signUpUser, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        formAction({ ...data });
    });

    const handleFieldChange = (fieldName: string) => {
        setTouchedFields((prev) => ({
            ...prev,
            [fieldName]: false, // Đặt lại trạng thái lỗi cho trường này
        }));
    };

    useEffect(() => {
        if (Object.values(errors).length > 0) {
            // Khi submit form, đánh dấu tất cả các trường là đã được submit
            const updatedTouchedFields = Object.keys(errors).reduce(
                (acc, fieldName) => ({
                    ...acc,
                    [fieldName]: true,
                }),
                touchedFields,
            );
            setTouchedFields(updatedTouchedFields);
        }
    }, [errors, touchedFields]);

    useEffect(() => {
        console.log('State updated:', state);
        if (state.success) {
            toast.success('Sign up successfully !!');
            router.push('/sign-in');
        }
        if (state.error) {
            toast.error(state.message || 'Sign up failed');
        }
    }, [state, router]);

    return (
        <div className="flex justify-center items-center pt-28">
            <form onSubmit={onSubmit} className="relative bg-slate-100 p-10 rounded-xl text-slate-500">
                <h1 className="text-center text-2xl text-neutral-700 font-medium">Sign Up</h1>
                <p className="text-sm">Welcome! Please sign up to continue</p>
                {/* info */}
                <>
                    <div className="border border-black/30 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <Image src={assets.person_icon} alt="person" />
                        <input
                            type="text"
                            {...register('name')}
                            placeholder="User name"
                            className="outline-none text-sm"
                            onChange={() => {
                                handleFieldChange('name');
                                clearErrors('name');
                            }}
                        />
                        {touchedFields.name && errors.name?.message && (
                            <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="border border-black/30 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <Image src={assets.email_icon} alt="email" />
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="Email Id"
                            className="outline-none text-sm"
                            onChange={() => {
                                handleFieldChange('email');
                                clearErrors('email');
                            }}
                        />
                        {touchedFields.email && errors.email?.message && (
                            <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="border border-black/30 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <Image src={assets.lock_icon} alt="lock" />
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="Password"
                            className="outline-none text-sm"
                            onChange={() => {
                                handleFieldChange('password');
                                clearErrors('password');
                            }}
                        />
                        {touchedFields.password && errors.password?.message && (
                            <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <p className="my-4"></p>
                </>
                <button className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">Sign Up</button>
                <p className="mt-5 text-center">
                    Already have an account?{' '}
                    <Link href={'/sign-in'} className="text-blue-600 cursor-pointer">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
