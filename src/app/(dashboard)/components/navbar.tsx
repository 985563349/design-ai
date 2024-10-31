import Link from 'next/link';

import UserDropdown from '@/components/user-dropdown';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center px-4 h-14">
      <Link href="/">
        <h1 className="text-xl font-bold">Design AI</h1>
      </Link>

      <div className="ml-auto">
        <UserDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
