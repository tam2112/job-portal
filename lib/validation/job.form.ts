import { z } from 'zod';

export const jobSchema = () => {
    return z.object({
        id: z.string().optional(),
        title: z.string().min(1, { message: 'Name is required' }),
        description: z.string().min(1, { message: 'Name is required' }),
        location: z.string().min(1, { message: 'Name is required' }),
        category: z.string().min(1, { message: 'Name is required' }),
        level: z.string().min(1, { message: 'Name is required' }),
        salary: z.coerce.number().min(1, { message: 'Salary is required' }),
        date: z.coerce.number().min(1, { message: 'Date is required' }),
        visible: z.boolean().default(false),
        companyId: z.string().nonempty({ message: 'Company id is required' }),
    });
};

export type JobSchema = z.infer<ReturnType<typeof jobSchema>>;
