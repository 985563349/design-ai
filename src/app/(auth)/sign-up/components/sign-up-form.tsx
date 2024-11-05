'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import type { InferRequestType } from 'hono';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, TriangleAlert } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { client } from '@/lib/hono';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const $post = client.api.users.$post;

const SignUpForm: React.FC = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const json = Object.fromEntries(formData) as InferRequestType<typeof $post>['json'];

      const response = await $post({ json });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      await signIn('credentials', { ...json, redirect: false });
    },

    onSuccess() {
      toast.success('User created');
      router.push('/');
    },
  });

  return (
    <Card className="min-w-96">
      <CardHeader>
        <CardTitle>Create an continue</CardTitle>
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
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(new FormData(e.currentTarget));
          }}
          className="space-y-2"
        >
          <Input name="name" type="text" placeholder="Full name" required />
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
          Already have an account?
          <Link href="/sign-in" className="ml-1 text-sky-700 hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
