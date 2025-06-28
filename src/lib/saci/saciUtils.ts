import { PrimeiroAndar, SegundoAndar, Subsolo, TerceiroAndar, Terreo } from './andares';
import raw from './raw.json';
import type { SVGAndaresCI, Saci } from './types';

export async function carregarDadosDoSaci(): Promise<Saci> {
  // TODO: Implementar a lógica de validação do carregamento dos dados do Saci e fallback
  // WARNING: unsafe as fuck, this is a JSON file that is not typed
  const data = raw as unknown as Saci;
  return data;
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
