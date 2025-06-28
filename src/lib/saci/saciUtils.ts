import { PrimeiroAndar, SegundoAndar, Subsolo, TerceiroAndar, Terreo } from './andares';
import type { SVGAndaresCI, Saci } from './types';

export async function carregarDadosDoSaci(): Promise<Saci> {
  const res = await fetch(
    'https://raw.githubusercontent.com/cacdia/cacdia.github.io/refs/heads/master/static/data/saci/saci.json'
  );
  if (!res.ok) {
    throw new Error(`Erro ao buscar dados: ${res.status}`);
  }
  const data = await res.json();
  return data as Saci;
}

export async function andaresDoCI(): Promise<SVGAndaresCI> {
  const dados = await carregarDadosDoSaci();
  const andares: SVGAndaresCI = {
    subsolo: Subsolo,
    terreo: Terreo,
    primeiro: PrimeiroAndar,
    segundo: SegundoAndar,
    terceiro: TerceiroAndar
  };

  for (const solution of dados.solution.solution) {
    const bloco = solution.bloco.toLowerCase();
    const nome = solution.nome.toLowerCase();

    if (bloco.includes('liepe') || bloco.includes('ctdr')) {
      continue;
    }

    if (bloco === 'sb') {
      const idx = andares.subsolo.findIndex((s) => s.codigo.toLowerCase().includes(nome));
      if (idx !== -1) {
        andares.subsolo[idx] = {
          saci: solution,
          ...andares.subsolo[idx]
        };
      }
    } else if (nome.startsWith('t') || bloco === 't' || nome.includes('auditório - t')) {
      const idx = andares.terreo.findIndex((s) => s.codigo.toLowerCase().includes(nome));
      if (idx !== -1) {
        andares.terreo[idx] = {
          saci: solution,
          ...andares.terreo[idx]
        };
      }
    } else if (nome.startsWith('1')) {
      const idx = andares.primeiro.findIndex((s) => s.codigo.toLowerCase().includes(nome));
      if (idx !== -1) {
        andares.primeiro[idx] = {
          saci: solution,
          ...andares.primeiro[idx]
        };
      }
    } else if (nome.startsWith('2')) {
      const idx = andares.segundo.findIndex((s) => s.codigo.toLowerCase().includes(nome));
      if (idx !== -1) {
        andares.segundo[idx] = {
          saci: solution,
          ...andares.segundo[idx]
        };
      }
    } else if (nome.startsWith('3')) {
      const idx = andares.terceiro.findIndex((s) => s.codigo.toLowerCase().includes(nome));
      if (idx !== -1) {
        andares.terceiro[idx] = {
          saci: solution,
          ...andares.terceiro[idx]
        };
      }
    }
  }

  return andares;
}
