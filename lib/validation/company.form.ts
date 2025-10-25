import { z } from 'zod';

export const signUpSchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().nonempty({ message: 'Name is required' }),
        email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email' }),
        password: z.string().nonempty({ message: 'Password is required' }),
        imageUrls: z.array(z.string()).optional(),
    });
};

export type SignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;

export const loginSchema = () => {
    return z.object({
        email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email' }),
        password: z.string().nonempty({ message: 'Password is required' }),
    });
};

export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;
