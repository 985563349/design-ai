import { FileIcon, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const ProjectSection: React.FC = () => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Recent projects</h3>

      <Table>
        <TableBody>
          <TableRow className="cursor-pointer">
            <TableCell className="font-medium">
              <div className="flex items-center gap-x-1 font-medium">
                <FileIcon className="size-4" />
                Car sale Poster
              </div>
            </TableCell>
            <TableCell>900 x 1200 px</TableCell>
            <TableCell>24 minutes ago</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Make a copy</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectSection;
