import { create } from 'zustand';
import Cookies from 'js-cookie';
import { getJobApplicationsByCompany, getJobApplicationsByUser } from '@/lib/actions/apply.action';

type JobApply = {
    id: string;
    user: { id: string; name: string; email: string; images: { url: string }[]; files: { url: string }[] };
    job: {
        id: string;
        title: string;
        location: string;
        date: bigint;
    };
    company: { id: string; name: string; images: { url: string }[] };
    status: { id: string; name: string };
};

type JobApplyStore = {
    applicationsByUser: JobApply[] | null;
    applicationsByCompany: JobApply[] | null;
    fetchApplicationsByUser: () => Promise<void>;
    fetchApplicationsByCompany: () => Promise<void>;
};

export const useJobApplyStore = create<JobApplyStore>((set) => ({
    applicationsByUser: [],
    fetchApplicationsByUser: async () => {
        try {
            const userId = Cookies.get('userId') || '';
            const data = await getJobApplicationsByUser(userId);
            set({ applicationsByUser: data });
        } catch (error) {
            console.error('Error fetching job apply:', error);
        }
    },
    applicationsByCompany: [],
    fetchApplicationsByCompany: async () => {
        try {
            const companyId = Cookies.get('userId') || '';
            const data = await getJobApplicationsByCompany(companyId);
            set({ applicationsByCompany: data });
        } catch (error) {
            console.error('Error fetching job apply:', error);
        }
    },
}));
