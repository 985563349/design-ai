import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import SignUpForm from './components/sign-up-form';

export default async function SignUp() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center h-full">
      <SignUpForm />
    </div>
  );
}
