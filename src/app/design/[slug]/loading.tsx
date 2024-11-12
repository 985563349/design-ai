import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 min-h-screen">
      <Loader className="size-6 text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
