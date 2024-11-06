'use client';

import { useSession, signOut } from 'next-auth/react';
import { Loader, LogOut } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserDropdown: React.FC = () => {
  const session = useSession();

  if (session.status === 'loading') {
    return <Loader className="size-4 text-muted-foreground animate-spin" />;
  }

  if (session.status === 'unauthenticated' || !session.data?.user) {
    return null;
  }

  const avatar = session.data.user.image!;
  const name = session.data.user.name!;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-10 hover:opacity-75 transition bg-white">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="flex items-center justify-center font-medium text-blue-400 bg-white">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuItem className="h-10" onClick={() => signOut()}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
