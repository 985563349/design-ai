import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import SignInForm from './components/sign-in-form';

export default async function SignIn() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center h-full">
      <SignInForm />
    </div>
  );
}
