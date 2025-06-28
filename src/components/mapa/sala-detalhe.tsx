// sala-detalhe.tsx
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SaciClasse, SaciRoom } from '@/lib/saci/types';

import { UsersIcon, XIcon } from 'lucide-react';

interface Props {
  sala: SaciRoom & {
    codigo?: string;
    acessivel?: boolean;
    preferencias?: { name: string; value: string | number }[];
    classes?: SaciClasse[];
  };
  onClose?: () => void;
}

export default function SalaDetalhe({ sala, onClose }: Props) {
  return (
    <div className='relative flex max-h-[80vh] w-full max-w-[90vw] flex-col space-y-4 overflow-y-auto p-4'>
      {/* Header com botão de fechar */}
      <div className='flex items-center justify-between'>
        <span className='text-xl font-bold'>{sala.codigo}</span>
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            aria-label='Fechar'
            className='hover:bg-muted rounded p-1 transition-colors'>
            <XIcon className='h-5 w-5' />
          </button>
        )}
      </div>

      {/* Capacidade */}
      <div className='flex items-center space-x-2'>
        <UsersIcon className='text-muted-foreground h-5 w-5' />
        <span className='font-medium'>Capacidade:</span>
        <span>{sala.capacidade}</span>
      </div>

      <Separator />

      {/* Turmas alocadas */}
      <h3 className='text-lg font-semibold'>Turmas alocadas</h3>
      {sala.classes?.length ? (
        // Contêiner que permite a tabela encolher corretamente
        <div className='w-full min-w-0'>
          <Table className='w-full table-fixed'>
            <TableHeader>
              <TableRow>
                <TableHead className='break-words whitespace-normal'>Disciplina</TableHead>
                <TableHead className='break-words whitespace-normal'>Horário</TableHead>
                <TableHead className='break-words whitespace-normal'>Docente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sala.classes.map((c, idx) => (
                <TableRow key={idx}>
                  <TableCell className='break-words whitespace-normal'>{c.nome}</TableCell>
                  <TableCell className='break-words whitespace-normal'>{c.horario}</TableCell>
                  <TableCell className='break-words whitespace-normal'>{c.docente}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Nenhuma turma alocada nesta sala.</p>
      )}
    </div>
  );
}
