import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Banner from './components/banner';
import TemplatesSection from './components/templats-section';
import ProjectSection from './components/project-section';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="flex flex-col min-h-full bg-muted">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 self-start space-y-4 rounded-tl-2xl p-8 bg-white">
          <Banner />
          <TemplatesSection />
          <ProjectSection />
        </main>
      </div>
    </div>
  );
}
