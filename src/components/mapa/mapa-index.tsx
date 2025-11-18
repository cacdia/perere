'use client';

import React, { useState } from 'react';

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import docentes from '@/lib/saci/docentes';
import outros from '@/lib/saci/outros';
import type { Docente, Outro, SVGAndaresCI, SVGRect } from '@/lib/saci/types';

import DocenteDetalhe from './docente-detalhe';
import OutroDetalhe from './outro-detalhe';
import Sala from './sala';
import SalaDetalhe from './sala-detalhe';

interface MapaIndexProps {
  andares: SVGAndaresCI;
}

interface TabItem {
  id: string;
  label: string;
  salas: SVGRect[];
}

const MapaDoAndar: React.FC<{
  salas: SVGRect[];
  onSalaClick?: (sala: SVGRect) => void;
  docentesPorSala?: Record<string, Docente[]>;
  segundoAndar?: boolean;
  outrosPorSala?: Record<string, Outro>;
}> = ({ salas, onSalaClick, docentesPorSala, segundoAndar, outrosPorSala }) => {
  function getRoomType(sala: SVGRect): 'corridor' | 'stairs' | 'other' {
    const lower = sala.codigo.trim().toLowerCase();
    if (lower === 'escada' || lower.includes('escada')) return 'stairs';
    if (lower === 'corredor' || lower.includes('corredor')) return 'corridor';
    return 'other';
  }

  function isAdjacentToSimilar(sala: SVGRect, otherSala: SVGRect): boolean {
    const salaType = getRoomType(sala);
    const otherType = getRoomType(otherSala);

    if (salaType !== otherType || salaType === 'other') return false;

    const tolerance = 2;
    const horizontallyAdjacent =
      Math.abs(sala.x + sala.width - otherSala.x) < tolerance ||
      Math.abs(otherSala.x + otherSala.width - sala.x) < tolerance;
    const verticallyAdjacent =
      Math.abs(sala.y + sala.height - otherSala.y) < tolerance ||
      Math.abs(otherSala.y + otherSala.height - sala.y) < tolerance;

    const horizontalOverlap = !(sala.y + sala.height < otherSala.y || otherSala.y + otherSala.height < sala.y);
    const verticalOverlap = !(sala.x + sala.width < otherSala.x || otherSala.x + otherSala.width < sala.x);

    return (horizontallyAdjacent && horizontalOverlap) || (verticallyAdjacent && verticalOverlap);
  }

  return (
    <div className='flex w-full justify-center px-4 md:px-6'>
      <svg
        version='1.1'
        viewBox='0 0 960 540'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='h-auto w-full max-w-6xl border-4 border-slate-700 bg-slate-100 shadow-xl dark:border-slate-300 dark:bg-slate-900'
        style={{ touchAction: 'manipulation' }}>
        <g>
          {salas.map((s, idx) => {
            const docentesSala = docentesPorSala?.[s.codigo] || [];
            const codigo = s.codigo.trim().toUpperCase();
            const isOutro = outrosPorSala && !!outrosPorSala[codigo];
            let isClickable = false;
            if (segundoAndar) {
              isClickable = docentesSala.length > 0;
            } else {
              isClickable = Boolean(s.saci) || Boolean(isOutro);
            }

            let saciProp = undefined;
            if (isClickable) {
              saciProp = {
                id: 0,
                bloco: '',
                nome: '',
                capacidade: 0,
                tipo: '',
                acessivel: false,
                preferencias: [],
                execao: '',
                excecao: '',
                classes: []
              };
            } else if (!segundoAndar) {
              saciProp = s.saci;
            }

            const hasAdjacentSimilar = salas.some(
              (other, otherIdx) => otherIdx !== idx && isAdjacentToSimilar(s, other)
            );
            const hasDocentes = segundoAndar && docentesSala.length > 0;

            return (
              <Sala
                key={`${s.codigo}-${idx}`}
                {...s}
                onClick={isClickable && onSalaClick ? () => onSalaClick(s) : undefined}
                saci={saciProp}
                isAdjacent={hasAdjacentSimilar}
                hasDocentes={hasDocentes}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default function MapaIndex({ andares }: MapaIndexProps) {
  const tabs: TabItem[] = [
    { id: 'subsolo', label: 'Subsolo', salas: andares.subsolo },
    { id: 'terreo', label: 'Térreo', salas: andares.terreo },
    { id: 'primeiro', label: '1º Andar', salas: andares.primeiro },
    { id: 'segundo', label: '2º Andar', salas: andares.segundo },
    { id: 'terceiro', label: '3º Andar', salas: andares.terceiro }
  ];

  const docentesPorSala: Record<string, import('@/lib/saci/types').Docente[]> = {};
  docentes.forEach((doc) => {
    if (doc.sala) {
      const sala = doc.sala.trim().toUpperCase();
      if (!docentesPorSala[sala]) docentesPorSala[sala] = [];
      docentesPorSala[sala].push(doc);
    }
  });

  const outrosPorSala: Record<string, import('@/lib/saci/types').Outro> = {};
  outros.forEach((outro) => {
    if (outro.sala) {
      outrosPorSala[outro.sala.trim().toUpperCase()] = outro;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('terreo');
  const [selectedSala, setSelectedSala] = useState<SVGRect | null>(null);
  const [showDocente, setShowDocente] = useState<string | null>(null);
  const [showOutro, setShowOutro] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSalaClick(sala: SVGRect) {
    setSelectedSala(sala);
    setShowDocente(null);
    setShowOutro(null);
    setDialogOpen(true);
  }
  function handleDocenteClick(codigo: string) {
    setShowDocente(codigo);
    setSelectedSala(null);
    setShowOutro(null);
    setDialogOpen(true);
  }
  function handleOutroClick(codigo: string) {
    setShowOutro(codigo);
    setSelectedSala(null);
    setShowDocente(null);
    setDialogOpen(true);
  }

  React.useEffect(() => {
    if (!dialogOpen && (selectedSala || showDocente || showOutro)) {
      const timeout = setTimeout(() => {
        setSelectedSala(null);
        setShowDocente(null);
        setShowOutro(null);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [dialogOpen, selectedSala, showDocente, showOutro]);

  function renderDialogContent() {
    if (showDocente) {
      return (
        <DocenteDetalhe
          salaCodigo={showDocente}
          docentes={docentesPorSala[showDocente] || []}
          onClose={() => setShowDocente(null)}
        />
      );
    }
    if (showOutro && outrosPorSala[showOutro]) {
      return <OutroDetalhe outro={outrosPorSala[showOutro]} onClose={() => setShowOutro(null)} />;
    }
    if (selectedSala?.saci) {
      return <SalaDetalhe sala={selectedSala.saci} />;
    }
    return null;
  }

  function getDialogTitle() {
    if (selectedSala?.codigo) return selectedSala.codigo;
    if (showDocente) return showDocente;
    if (showOutro) return showOutro;
    return '';
  }

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8'>
      <div className='mb-6 flex w-full justify-center'>
        <div className='w-full max-w-6xl'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <div className='mb-4 flex justify-center'>
              <TabsList className='grid w-full max-w-md grid-cols-5'>
                {tabs.map(({ id, label }) => (
                  <TabsTrigger key={id} value={id} className='text-xs md:text-sm'>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabs.map(({ id, salas }) => {
              let handleSalaClickFn: ((sala: SVGRect) => void) | undefined;
              let docentesPorSalaProp: Record<string, import('@/lib/saci/types').Docente[]> | undefined;
              let segundoAndarProp = false;
              let outrosPorSalaProp: Record<string, import('@/lib/saci/types').Outro> | undefined;

              if (id === 'segundo') {
                handleSalaClickFn = (sala) => handleDocenteClick(sala.codigo);
                docentesPorSalaProp = docentesPorSala;
                segundoAndarProp = true;
              } else {
                handleSalaClickFn = (sala) => {
                  const codigo = sala.codigo.trim().toUpperCase();
                  if (outrosPorSala[codigo]) {
                    handleOutroClick(codigo);
                  } else {
                    handleSalaClick(sala);
                  }
                };
                outrosPorSalaProp = outrosPorSala;
              }

              return (
                <TabsContent key={id} value={id} className='mt-0'>
                  <MapaDoAndar
                    salas={salas}
                    onSalaClick={handleSalaClickFn}
                    docentesPorSala={docentesPorSalaProp}
                    segundoAndar={segundoAndarProp}
                    outrosPorSala={outrosPorSalaProp}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {(selectedSala || showDocente || showOutro) && renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
