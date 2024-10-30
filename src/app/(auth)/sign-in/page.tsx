import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { auth, signIn } from '@/auth';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

export default async function SignIn() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  const onCredentialSignIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email');
    const password = formData.get('password');

    await signIn('credentials', { email, password, redirectTo: '/' });
  };

  const onProviderSignIn = async (formData: FormData) => {
    'use server';

    const action = formData.get('action') as string;

    await signIn(action, { redirectTo: '/' });
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card>
        <CardHeader>
          <CardTitle>Login to continue</CardTitle>
          <CardDescription>Use your email or anther service to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form action={onCredentialSignIn} className="space-y-2">
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            <Button className="w-full" type="submit">
              Continue
            </Button>
          </form>

          <Separator />

          <form action={onProviderSignIn} className="flex flex-col space-y-2">
            <Button type="submit" name="action" value="google" variant="outline">
              <FcGoogle />
              Continue with Google
            </Button>
            <Button type="submit" name="action" value="github" variant="outline">
              <FaGithub />
              Continue with Github
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?
            <Link href="/sign-up" className="ml-1 text-sky-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
