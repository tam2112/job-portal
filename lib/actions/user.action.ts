'use server';

import bcrypt from 'bcrypt';

import { loginSchema, LoginSchema, signUpSchema, SignUpSchema } from '../validation/user.form';
import prisma from '../prisma';
import { generateToken } from '../auth';
import { Role, User } from '@/types/prisma';

type CurrentState = { success: boolean; error: boolean };

export const signUpUser = async (
    currentState: CurrentState,
    data: SignUpSchema,
): Promise<{
    success: boolean;
    error: boolean;
    message?: string;
    token?: string;
    userId?: string;
    user?: User & { role: Role };
}> => {
    try {
        signUpSchema().parse(data);

        // check username exists
        const existingName = await prisma.user.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            return {
                success: false,
                error: true,
                message: 'Name is already exists',
            };
        }

        // check email exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            return {
                success: false,
                error: true,
                message: 'Email is already exists',
            };
        }

        // Lấy role Guest từ database
        const guestRole = await prisma.role.findUnique({
            where: { name: 'guest' },
        });

        if (!guestRole) {
            console.error('Guest role not found in database');
            return {
                success: false,
                error: true,
                message: 'Guest role not found',
            };
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Tạo người dùng mới với role Guest
        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                password: hashedPassword,
                email: data.email,
                roleId: guestRole.id, // Sử dụng ID của role Guest
            },
            include: {
                role: true, // Include role information in the response
            },
        });

        // Tạo token cho người dùng
        const token = generateToken(newUser.id, newUser.role.name);

        const result = {
            success: true,
            error: false,
            token,
            userId: newUser.id,
            user: newUser,
        };
        console.log('signUpUser result:', result);

        return result;
    } catch (error) {
        console.error('Error in signUpUser:', error);

        return { success: false, error: true };
    }
};

export const signInUser = async (currentState: CurrentState, data: LoginSchema) => {
    try {
        loginSchema().parse(data);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true }, // Include role information
        });

        if (!user) {
            return {
                success: false,
                error: true,
                message: 'Email not exists',
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: 'Password not match',
            };
        }

        // Generate token with role information
        const token = generateToken(user.id, user.role.name);
        const userId = user.id;
        const name = user.name;
        const email = user.email;

        return {
            success: true,
            error: false,
            userId,
            name,
            email,
            token,
            user,
            role: user.role.name, // Include role in response
            users: {
                ...user,
                role: user.role.name,
            },
        };
    } catch (error) {
        console.error('Error in signInUser:', error);
        return { success: false, error: true, message: 'Sign in failed' };
    }
};

export const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({});
        return users;
    } catch (error) {
        console.error(error);
    }
};

export const getUserCount = async () => {
    try {
        const count = await prisma.user.count();
        return count;
    } catch (error) {
        console.error('Error fetching user count:', error);
        return 0;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                images: {
                    select: { url: true },
                },
                role: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!user) {
            throw new Error('user not found');
        }

        return user;
    } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
    }
};

export const getUserResume = async (userId: string) => {
    try {
        const file = await prisma.file.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return file;
    } catch (error) {
        console.error('Error fetching user resume:', error);
        return null;
    }
};

export const uploadUserFile = async (userId: string, fileUrl: string) => {
    try {
        await prisma.file.deleteMany({
            where: { userId },
        });

        const file = await prisma.file.create({
            data: {
                url: fileUrl,
                userId,
            },
        });
        return { success: true, file };
    } catch (error) {
        console.error('Error uploading user file:', error);
        return { success: false, message: 'Failed to save file' };
    }
};
