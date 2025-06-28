'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant='outline'
      size='icon'
      aria-label='Alternar tema'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
    </Button>
  );
}
