import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function SignIn() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card>
        <CardHeader>
          <CardTitle>Login to continue</CardTitle>
          <CardDescription>Use your email or anther service to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="lg">
              <FcGoogle />
              Continue with Google
            </Button>
            <Button variant="outline" size="lg">
              <FaGithub />
              Continue with Github
            </Button>
          </div>
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
