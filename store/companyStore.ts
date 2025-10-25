import { create } from 'zustand';
import Cookies from 'js-cookie';
import { getCompanies, getCompanyById } from '@/lib/actions/company.action';

type Company = {
    id: string;
    name: string;
    email: string;
    password: string;
    images: { url: string }[];
    role: { id: string; name: string };
};

type CompanyStore = {
    company: Company | null;
    companies: Company[] | null;
    fetchCompany: () => Promise<void>;
    fetchCompanies: () => Promise<void>;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
    company: null,
    fetchCompany: async () => {
        try {
            const companyId = Cookies.get('userId') || '';
            const data = await getCompanyById(companyId);
            set({ company: data });
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    },
    companies: [],
    fetchCompanies: async () => {
        try {
            const data = await getCompanies();
            set({ companies: data });
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    },
}));
