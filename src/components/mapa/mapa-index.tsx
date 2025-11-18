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
}> = ({ salas, onSalaClick, docentesPorSala, segundoAndar, outrosPorSala }) => (
  <div className='flex w-full justify-center'>
    <svg
      version='1.1'
      viewBox='0 0 960 540'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='h-auto w-full max-w-6xl rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-950'>
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

          return (
            <Sala
              key={`${s.codigo}-${idx}`}
              {...s}
              onClick={isClickable && onSalaClick ? () => onSalaClick(s) : undefined}
              saci={saciProp}
            />
          );
        })}
      </g>
    </svg>
  </div>
);

export default function MapaIndex({ andares }: MapaIndexProps) {
  const tabs: TabItem[] = [
    { id: 'subsolo', label: 'Subsolo', salas: andares.subsolo },
    { id: 'terreo', label: 'Térreo', salas: andares.terreo },
    { id: 'primeiro', label: '1º Andar', salas: andares.primeiro },
    { id: 'segundo', label: '2º Andar', salas: andares.segundo },
    { id: 'terceiro', label: '3º Andar', salas: andares.terceiro }
  ];

  // Mapeia docentes por sala do segundo andar
  const docentesPorSala: Record<string, import('@/lib/saci/types').Docente[]> = {};
  docentes.forEach((doc) => {
    if (doc.sala) {
      const sala = doc.sala.trim().toUpperCase();
      if (!docentesPorSala[sala]) docentesPorSala[sala] = [];
      docentesPorSala[sala].push(doc);
    }
  });

  // Mapeia outros por sala
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

  // Função para abrir o modal com o conteúdo correto
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

  // Limpa o conteúdo SÓ após a animação de saída terminar
  React.useEffect(() => {
    if (!dialogOpen && (selectedSala || showDocente || showOutro)) {
      const timeout = setTimeout(() => {
        setSelectedSala(null);
        setShowDocente(null);
        setShowOutro(null);
      }, 200); // ajuste conforme a duração da animação do Dialog
      return () => clearTimeout(timeout);
    }
  }, [dialogOpen, selectedSala, showDocente, showOutro]);

  // Função para renderizar o conteúdo do Dialog
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

  // Função para obter o título do Dialog
  function getDialogTitle() {
    if (selectedSala?.codigo) return selectedSala.codigo;
    if (showDocente) return showDocente;
    if (showOutro) return showOutro;
    return '';
  }

  return (
    <>
      {/* Navegação por andares */}
      <div className='mb-6 flex w-full justify-center'>
        <div className='w-full max-w-6xl'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList>
              {tabs.map(({ id, label }) => (
                <TabsTrigger key={id} value={id}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
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
                <TabsContent key={id} value={id}>
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

      {/* Modal de detalhes da sala, docente ou outro */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {/* Só renderiza conteúdo se houver conteúdo, não apenas quando dialogOpen for true */}
          {(selectedSala || showDocente || showOutro) && renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
