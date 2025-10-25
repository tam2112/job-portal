'use server';

import bcrypt from 'bcrypt';

import prisma from '../prisma';
import { generateToken } from '../auth';
import { Company, Role } from '@/types/prisma';
import { loginSchema, LoginSchema, signUpSchema, SignUpSchema } from '../validation/company.form';

type CurrentState = { success: boolean; error: boolean };

export const signUpCompany = async (
    currentState: CurrentState,
    data: SignUpSchema & { imageUrls?: string[] },
): Promise<{
    success: boolean;
    error: boolean;
    message?: string;
    token?: string;
    userId?: string;
    company?: Company & { role: Role };
}> => {
    try {
        signUpSchema().parse(data);

        // check username exists
        const existingName = await prisma.company.findUnique({
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
        const existingEmail = await prisma.company.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            return {
                success: false,
                error: true,
                message: 'Email is already exists',
            };
        }

        // Lấy role recruiter từ database
        const recruiterRole = await prisma.role.findUnique({
            where: { name: 'recruiter' },
        });

        if (!recruiterRole) {
            console.error('Recruiter role not found in database');
            return {
                success: false,
                error: true,
                message: 'Recruiter role not found',
            };
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Tạo người dùng mới với role recruiter
        const newCompany = await prisma.company.create({
            data: {
                name: data.name,
                password: hashedPassword,
                email: data.email,
                roleId: recruiterRole.id, // Sử dụng ID của role Recruiter
            },
            include: {
                role: true, // Include role information in the response
            },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    companyId: newCompany.id,
                    createdAt: new Date(),
                })),
            });
        }

        // Tạo token cho người dùng
        const token = generateToken(newCompany.id, newCompany.role.name);

        const result = {
            success: true,
            error: false,
            token,
            userId: newCompany.id,
            user: newCompany,
        };
        console.log('signUpUser result:', result);

        return result;
    } catch (error) {
        console.error('Error in signUpUser:', error);

        return { success: false, error: true };
    }
};

export const signInCompany = async (currentState: CurrentState, data: LoginSchema) => {
    try {
        loginSchema().parse(data);

        const company = await prisma.company.findUnique({
            where: { email: data.email },
            include: { role: true }, // Include role information
        });

        if (!company) {
            return {
                success: false,
                error: true,
                message: 'Email not exists',
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, company.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: 'Password not match',
            };
        }

        // Generate token with role information
        const token = generateToken(company.id, company.role.name);
        const userId = company.id;
        const name = company.name;
        const email = company.email;

        return {
            success: true,
            error: false,
            userId,
            name,
            email,
            token,
            company,
            role: company.role.name, // Include role in response
            companies: {
                ...company,
                role: company.role.name,
            },
        };
    } catch (error) {
        console.error('Error in signInCompany:', error);
        return { success: false, error: true, message: 'Sign in failed' };
    }
};

export const getCompanies = async () => {
    try {
        const companies = await prisma.company.findMany({
            include: {
                images: {
                    select: { url: true },
                },
                role: {
                    select: { id: true, name: true },
                },
            },
        });
        return companies;
    } catch (error) {
        console.error(error);
    }
};

export const getCompanyCount = async () => {
    try {
        const count = await prisma.company.count();
        return count;
    } catch (error) {
        console.error('Error fetching company count:', error);
        return 0;
    }
};

export const getCompanyById = async (id: string) => {
    try {
        const company = await prisma.company.findUnique({
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
        if (!company) {
            throw new Error('company not found');
        }

        return company;
    } catch (error) {
        console.error('Error fetching company by id:', error);
        return null;
    }
};
