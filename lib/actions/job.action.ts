'use server';

import prisma from '../prisma';
import { currentTimestamp } from '../utils';
import { JobSchema } from '../validation/job.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getJobs = async () => {
    try {
        const products = await prisma.job.findMany({
            include: {
                company: { select: { id: true, name: true, images: { select: { url: true } } } },
            },
        });
        return products;
    } catch (error) {
        console.error(error);
    }
};

export const getJobCount = async () => {
    try {
        const count = await prisma.job.count();
        return count;
    } catch (error) {
        console.error('Error fetching Job count:', error);
        return 0;
    }
};

export const getJobById = async (id: string) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                company: { select: { id: true, name: true, images: { select: { url: true } } } },
            },
        });
        if (!job) {
            throw new Error('job not found');
        }

        return job;
    } catch (error) {
        console.error('Error fetching job by id:', error);
        return null;
    }
};

export const getJobsByCompanyId = async (id: string) => {
    try {
        const job = await prisma.job.findMany({
            where: { companyId: id },
            include: {
                company: true,
            },
        });
        if (!job) {
            throw new Error('job not found');
        }

        return job;
    } catch (error) {
        console.error('Error fetching job by id:', error);
        return null;
    }
};

export const createJob = async (currentState: CurrentState, data: JobSchema) => {
    try {
        await prisma.job.create({
            data: {
                title: data.title,
                description: data.description,
                location: data.location,
                category: data.category,
                level: data.level,
                salary: Number(data.salary),
                date: currentTimestamp,
                visible: data.visible,
                companyId: data.companyId,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Product name is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateJob = async (currentState: CurrentState, data: JobSchema) => {
    try {
        if (!data.id) {
            throw new Error('Job ID is required for update');
        }

        await prisma.job.update({
            where: { id: data.id },
            data: {
                title: data.title,
                description: data.description,
                location: data.location,
                category: data.category,
                level: data.level,
                salary: Number(data.salary),
                visible: data.visible,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Job name is already exists',
            };
        }
        return { success: false, error: true, message: 'Update failed' };
    }
};

export const updateJobVisibility = async (jobId: string, visible: boolean) => {
    try {
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: { visible },
        });
        return { success: true, error: false, doctor: updatedJob };
    } catch (error) {
        console.error('Error updating job visibility:', error);
        return { success: false, error: true, message: 'Failed to update job visibility' };
    }
};

export const deleteJob = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Job ID is required');
        }

        await prisma.job.delete({
            where: {
                id,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: true };
    }
};

export const deleteJobById = async (id: string) => {
    try {
        await prisma.job.delete({
            where: {
                id,
            },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
