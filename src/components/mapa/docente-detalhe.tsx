import React from 'react';

import { Separator } from '@/components/ui/separator';
import type { Docente } from '@/lib/saci/types';

interface Props {
  docentes: Docente[];
  salaCodigo: string;
  onClose?: () => void;
}

export default function DocenteDetalhe({ docentes }: Props) {
  return (
    <div className='relative flex max-h-[80vh] w-full max-w-[90vw] flex-col space-y-4 overflow-y-auto p-4'>
      {docentes.length ? (
        <ul className='space-y-3'>
          {docentes.map((docente, idx) => (
            <React.Fragment key={docente.nome || idx}>
              <li className='flex flex-col gap-1'>
                <span className='text-base font-medium'>{docente.nome}</span>
                {docente.departamento && <span className='text-muted-foreground text-sm'>{docente.departamento}</span>}
                {docente.sigaa && (
                  <a
                    href={docente.sigaa}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-blue-600 underline'>
                    Ver perfil no SIGAA
                  </a>
                )}
              </li>
              {docentes.length > 1 && idx < docentes.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p>Nenhum docente cadastrado nesta sala.</p>
      )}
    </div>
  );
}
