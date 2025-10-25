import Navbar from '@/components/dashboard/home/Navbar';
import Sidebar from '@/components/dashboard/home/Sidebar';
import 'quill/dist/quill.snow.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex items-start">
                <Sidebar />
                {children}
            </div>
        </div>
    );
}
