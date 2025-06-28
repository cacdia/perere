import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

import { ModeToggle } from './mode-toggle';

export default function Navbar() {
  return (
    <header className='border-b px-4 md:px-6'>
      <div className='flex h-16 items-center justify-between gap-4'>
        {/* Logo */}
        <div className='flex-1'>
          <Logo />
        </div>
        {/* Middle area - removed search bar */}
        <div className='grow max-sm:hidden'></div>
        {/* Right side */}
        <div className='flex flex-1 items-center justify-end gap-2'>
          <Button asChild variant='ghost' size='sm' className='text-sm' disabled>
            <a href=''>#CDIAPremium</a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
