import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Banner from './components/banner';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="flex flex-col h-full bg-muted">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 self-start rounded-tl-2xl p-8 bg-white">
          <Banner />
        </main>
      </div>
    </div>
  );
}
