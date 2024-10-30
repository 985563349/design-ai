import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { auth, signIn } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { client } from '@/lib/hono';

export default async function SignUp() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  const onCredentialSignUp = async (formData: FormData) => {
    'use server';

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await client.api.users.$post({ json: { name, email, password } });

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    await signIn('credentials', { email, password, redirectTo: '/' });
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card>
        <CardHeader>
          <CardTitle>Create an continue</CardTitle>
          <CardDescription>Use your email or anther service to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form action={onCredentialSignUp} className="space-y-2">
            <Input name="name" type="text" placeholder="Full name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            <Button className="w-full" type="submit">
              Continue
            </Button>
          </form>

          <Separator />

          <form className="flex flex-col space-y-2">
            <Button variant="outline" size="lg">
              <FcGoogle />
              Continue with Google
            </Button>
            <Button variant="outline" size="lg">
              <FaGithub />
              Continue with Github
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Already have an account?
            <Link href="/sign-in" className="ml-1 text-sky-700 hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
