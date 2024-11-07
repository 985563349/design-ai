import Editor from './components/editor';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { client } from '@/lib/hono';
import { cookies } from 'next/headers';

const fetchProject = async (id: string) => {
  const url = client.api.projects[':id'].$url({ param: { id } });
  const cookieStore = await cookies();
  const response = await fetch(url, { cache: 'no-cache', headers: { cookie: cookieStore.toString() } });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return (await response.json()).data;
};

export default async function Design({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  const { width, height, json } = await fetchProject(slug);

  return (
    <div className="h-full">
      <Editor id={slug} width={width} height={height} initialState={json} />
    </div>
  );
}
