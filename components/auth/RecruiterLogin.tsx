import { assets } from '@/public/assets';
import Image from 'next/image';

export default function RecruiterLogin() {
    return (
        <div className="absolute top-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form className="relative bg-white p-10 rounded-xl text-slate-500">
                <h1 className="text-center text-2xl text-neutral-700 font-medium">Recruiter Login</h1>
                <p className="text-sm">Welcome back! Please sign in to continue</p>
                {/* upload image */}
                <>
                    <div className="flex items-center gap-4 my-10">
                        <label htmlFor="image">
                            <Image src={assets.upload_area} alt="upload area" className="w-16 rounded-full" />
                            <input type="file" id="image" hidden />
                            <p>
                                Upload Company <br />
                                logo
                            </p>
                        </label>
                    </div>
                </>
                {/* info */}
                <>
                    {/* <div className="border border-black/30 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                    <Image src={assets.person_icon} alt="person" />
                    <input type="text" placeholder="Company name" className="outline-none text-sm" />
                </div> */}
                    <div className="border border-black/30 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <Image src={assets.email_icon} alt="email" />
                        <input type="email" placeholder="Email Id" className="outline-none text-sm" />
                    </div>
                    <div className="border border-black/30 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                        <Image src={assets.lock_icon} alt="lock" />
                        <input type="password" placeholder="Password" className="outline-none text-sm" />
                    </div>

                    <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>
                </>
                <button className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">Login</button>
                <p className="mt-5 text-center">
                    Don&apos;t have an account? <span className="text-blue-600 cursor-pointer">Sign Up</span>
                </p>
                {/* <p className="mt-5 text-center">Already have an account? <span className="text-blue-600 cursor-pointer">Login</span></p> */}
            </form>
        </div>
    );
}
