'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/lib/validation/user.form';
import { signInUser } from '@/lib/actions/user.action';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import { assets } from '@/public/assets';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema()),
    });

    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [state] = useState({
        success: false,
        error: false,
        message: '',
    });

    const router = useRouter();

    const { setIsLoggedIn } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        const response = await signInUser(state, data);

        if (response.success) {
            if (response.token) {
                Cookies.set('token', response.token, { expires: 1 });
            }
            if (response.userId) {
                Cookies.set('userId', response.userId);
            }
            if (response.name) {
                Cookies.set('name', response.name);
            }
            if (response.email) {
                Cookies.set('email', response.email);
            }
            if (response.role) {
                Cookies.set('role', response.role);
            }
            setIsLoggedIn(true);
            router.push('/');
            toast.success('Sign in successfully !!');
        } else {
            toast.error(response.message || 'Sign in failed');
            setTouchedFields({});
        }
    });

    const handleFieldChange = (fieldName: string) => {
        setTouchedFields((prev) => ({
            ...prev,
            [fieldName]: false,
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

    return (
        <div className="flex justify-center items-center pt-28">
            <form onSubmit={onSubmit} className="relative bg-slate-100 shadow p-10 rounded-xl text-slate-500">
                <h1 className="text-center text-2xl text-neutral-700 font-medium">Login</h1>
                <p className="text-sm">Welcome back! Please sign in to continue</p>
                {/* info */}
                <>
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

                    <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>
                </>
                <button className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">Login</button>
                <p className="mt-5 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href={'/sign-up'} className="text-blue-600 cursor-pointer">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
