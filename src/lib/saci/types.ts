export interface Saci {
  id: string;
  centro: string;
  date: string;
  description: string;
  solution_hash: string;
  status: string;
  userId: string | null;
  solution: SaciSolution;
}

export interface SaciSolution {
  hash: string;
  status: string;
  error: string;
  solution: SaciRoom[];
}

export interface SaciRoom {
  id: number;
  bloco: string;
  nome: string;
  capacidade: number;
  tipo: string;
  acessivel: boolean;
  preferencias: SaciPreference[];
  execao: string;
  excecao: string;
  classes: SaciClasse[];
}

export interface SaciPreference {
  name: string;
  value: number | string;
}

export interface SaciClasse {
  id: number;
  codigo: string;
  nome: string;
  turma: string;
  docente: string;
  departamento: string;
  horario: string;
  alunos: number;
  preferencias: SaciPreference[];
  pcd: boolean;
}

export interface SVGRect {
  x: number;
  y: number;
  width: number;
  height: number;
  codigo: string;
  saci?: SaciRoom;
  hasExternalEdge?: boolean;
}

export interface SVGAndaresCI {
  subsolo: SVGRect[];
  terreo: SVGRect[];
  primeiro: SVGRect[];
  segundo: SVGRect[];
  terceiro: SVGRect[];
}

export interface Docente {
  nome: string;
  departamento?: string;
  sigaa?: string;
  sala?: string;
}

export interface Outro {
  abreviacao: string;
  name: string;
  description?: string;
  logo?: string;
  url?: string;
  sala?: string;
}
