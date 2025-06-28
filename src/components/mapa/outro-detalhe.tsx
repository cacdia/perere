import React from 'react';

import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import type { Outro } from '@/lib/saci/types';

interface Props {
  outro: Outro;
  onClose?: () => void;
}

export default function OutroDetalhe({ outro }: Props) {
  return (
    <div className='relative flex max-h-[80vh] w-full max-w-[90vw] flex-col space-y-4 overflow-y-auto p-4'>
      <div className='flex flex-col items-center space-y-2'>
        {outro.logo && (
          <Image
            src={outro.logo}
            alt={outro.abreviacao}
            width={96}
            height={96}
            className='mb-2 h-24 w-24 rounded object-contain'
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        )}
        <span className='text-center text-lg font-bold'>{outro.name}</span>
        {outro.sala && <span className='text-muted-foreground text-sm'>Sala: {outro.sala}</span>}
        {outro.url && (
          <a href={outro.url} target='_blank' rel='noopener noreferrer' className='text-xs text-blue-600 underline'>
            Acessar site
          </a>
        )}
      </div>
      {outro.description && (
        <>
          <Separator />
          <p className='text-justify text-sm'>{outro.description}</p>
        </>
      )}
    </div>
  );
}
