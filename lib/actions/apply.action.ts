'use server';

import prisma from '../prisma';
import { currentTimestamp } from '../utils';

export const applyJob = async (userId: string, jobId: string, companyId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return { success: false, error: true, message: 'User not found. Please log in as a user.' };
        }

        const jobCheck = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!jobCheck) {
            return { success: false, error: true, message: 'Job not found.' };
        }

        const existingApplication = await prisma.jobApplication.findFirst({
            where: {
                userId,
                jobId,
                companyId,
            },
        });

        if (existingApplication) {
            return { success: false, error: true, message: 'This job already applied' };
        }

        const pendingStatus = await prisma.status.findUnique({
            where: { name: 'Pending' },
        });

        if (!pendingStatus) {
            throw new Error('Pending status not found');
        }

        // Create ApplyJob record
        const apply = await prisma.jobApplication.create({
            data: {
                userId,
                jobId,
                companyId,
                statusId: pendingStatus.id,
                date: currentTimestamp,
            },
        });

        return { success: true, error: false, apply };
    } catch (error) {
        console.error('Error apply job:', error);
        return { success: false, error: true, message: 'Failed to apply job' };
    }
};

export const checkIfApplied = async (userId: string, jobId: string, companyId: string) => {
    try {
        const existingApplication = await prisma.jobApplication.findFirst({
            where: {
                userId,
                jobId,
                companyId,
            },
        });

        return !!existingApplication;
    } catch (error) {
        console.error('Error checking if applied:', error);
        return false;
    }
};

export const getJobApplicationsByUser = async (userId: string) => {
    try {
        const applications = await prisma.jobApplication.findMany({
            where: {
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        images: { select: { url: true } },
                        files: { select: { url: true } },
                    },
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        date: true,
                    },
                },
                company: { select: { id: true, name: true, images: { select: { url: true } } } },
                status: { select: { id: true, name: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return applications;
    } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
    }
};

export const getJobApplicationsByCompany = async (companyId: string) => {
    try {
        const applications = await prisma.jobApplication.findMany({
            where: {
                companyId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        images: { select: { url: true } },
                        files: { select: { url: true } },
                    },
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        date: true,
                    },
                },
                company: { select: { id: true, name: true, images: { select: { url: true } } } },
                status: { select: { id: true, name: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return applications;
    } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
    }
};

export const updateApplicationStatus = async (applicationId: string, statusName: string) => {
    try {
        const status = await prisma.status.findUnique({
            where: { name: statusName },
        });

        if (!status) {
            return { success: false, message: `${statusName} status not found` };
        }

        const updated = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: { statusId: status.id },
        });

        return { success: true, updated };
    } catch (error) {
        console.error('Error updating status:', error);
        return { success: false, message: 'Failed to update status' };
    }
};
