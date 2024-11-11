'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, TriangleAlert } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const SignInForm: React.FC = () => {
  const route = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await signIn('credentials', { ...Object.fromEntries(formData), redirect: false });

      if (response?.error && response.code) {
        throw new Error(response.code ?? 'Something went wrong');
      }
    },

    onSuccess() {
      route.push('/');
    },
  });

  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or anther service to continue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {mutation.isError && (
          <div className="flex items-center space-x-2 rounded-md p-3 text-sm text-destructive bg-destructive/15">
            <TriangleAlert />
            <p>{mutation.error.message}</p>
          </div>
        )}

        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(new FormData(e.currentTarget));
          }}
        >
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={() => signIn('google', { redirectTo: '/' })}>
            <FcGoogle />
            Continue with Google
          </Button>

          <Button variant="outline" onClick={() => signIn('github', { redirectTo: '/' })}>
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
  );
};

export default SignInForm;
