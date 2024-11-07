'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, FileIcon, Loader, MoreHorizontal, Search } from 'lucide-react';

import { client } from '@/lib/hono';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const ProjectSection: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.projects.$get({ query: { page: `${pageParam}` } });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await client.api.projects[':id'].$delete({ param: { id } });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  if (status === 'pending') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex items-center justify-center min-h-32">
          <Loader className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex flex-col items-center justify-center gap-y-4 min-h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Error fetching projects</p>
        </div>
      </div>
    );
  }

  if (!data?.pages.length || !data?.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex flex-col items-center justify-center gap-y-4 min-h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent projects</h3>

      <Table>
        <TableBody>
          {data?.pages.map((page, index) => (
            <Fragment key={index}>
              {page.data.map((project) => (
                <TableRow className="cursor-pointer" key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-x-1 font-medium">
                      <FileIcon className="size-4" />
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.width} x {project.height} px
                  </TableCell>
                  <TableCell>{formatDistanceToNow(project.createdAt, { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/design/${project.id}`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => mutation.mutate(project.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>

      {hasNextPage && (
        <Button className="w-full" variant="ghost" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
          Load more
        </Button>
      )}
    </div>
  );
};

export default ProjectSection;
