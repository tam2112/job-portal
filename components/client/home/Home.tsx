import AppDownload from './AppDownload';
import Hero from './Hero';
import JobList from './JobList';

export default function Home() {
    return (
        <div>
            <Hero />
            <JobList />
            <AppDownload />
        </div>
    );
}
