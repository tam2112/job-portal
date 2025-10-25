'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type JobContextType = {
    searchFilter: { title: string; location: string };
    setSearchFilter: Dispatch<SetStateAction<{ title: string; location: string }>>;
    isSearched: boolean;
    setIsSearched: Dispatch<SetStateAction<boolean>>;
};

const JobContext = createContext<JobContextType | null>(null);

export function JobProvider({ children }: { children: ReactNode }) {
    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: '',
    });
    const [isSearched, setIsSearched] = useState(false);

    const value = {
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
    };

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export const useJob = () => {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJob must be used within a JobProvider');
    }
    return context;
};
