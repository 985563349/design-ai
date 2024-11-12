'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

import { client } from '@/lib/hono';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  width: z.coerce.number().min(100, {
    message: 'Width must be at least 100.',
  }),
  height: z.coerce.number().min(100, {
    message: 'Height must be at least 100.',
  }),
});

const $post = client.api.projects.$post;

const CreateProjectDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const mutation = useMutation<InferResponseType<typeof $post, 200>, Error, InferRequestType<typeof $post>['json']>({
    mutationFn: async (json) => {
      const response = await $post({ json });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return response.json();
    },
    onSuccess: (data) => router.push(`/design/${data.id}`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      width: 900,
      height: 1200,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate({ ...values, json: '' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => form.reset()}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Width" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Height" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button form="form" type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Banner: React.FC = () => {
  return (
    <div className="flex items-center gap-x-6 rounded-xl p-6 aspect-[5/1] text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
      <div className="flex items-center justify-center rounded-full size-28 bg-white/50">
        <div className="flex items-center justify-center rounded-full size-20 bg-white">
          <Sparkles className="text-blue-600 fill-blue-600" />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-semibold">Visualize your ideas with Image AI</h1>
        <p className="mb-2 text-sm">
          Turn inspiration into design in no time. Simply upload an image and let AI do the rest.
        </p>

        <CreateProjectDialog>
          <Button className="w-40" variant="secondary">
            Start creating
            <ArrowRight />
          </Button>
        </CreateProjectDialog>
      </div>
    </div>
  );
};

export default Banner;
