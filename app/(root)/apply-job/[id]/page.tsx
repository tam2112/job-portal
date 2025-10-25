import ApplyJob from '@/components/client/ApplyJob';
import { getJobById } from '@/lib/actions/job.action';

interface ApplyJobPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ApplyJobPage({ params }: ApplyJobPageProps) {
    const { id } = await params;
    const job = await getJobById(id);

    return (
        <div>
            <ApplyJob job={job} />
        </div>
    );
}
