import { getJobs, getJobsByCompanyId } from '@/lib/actions/job.action';
import { create } from 'zustand';
import Cookies from 'js-cookie';

type Job = {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    level: string;
    salary: number;
    date: bigint;
    visible: boolean;
    companyId: string;
};

type JobArray = {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    level: string;
    salary: number;
    date: bigint;
    visible: boolean;
    company: { id: string; name: string; images: { url: string }[] };
};

type JobStore = {
    jobsByCompany: Job[] | null;
    jobs: JobArray[] | null;
    fetchJobsByCompany: () => Promise<void>;
    fetchJobs: () => Promise<void>;
};

export const useJobStore = create<JobStore>((set) => ({
    jobsByCompany: [],
    fetchJobsByCompany: async () => {
        try {
            const companyId = Cookies.get('userId') || '';
            const data = await getJobsByCompanyId(companyId);
            set({ jobsByCompany: data });
        } catch (error) {
            console.error('Error fetching job by company:', error);
        }
    },
    jobs: [],
    fetchJobs: async () => {
        try {
            const data = await getJobs();
            set({ jobs: data });
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    },
}));
