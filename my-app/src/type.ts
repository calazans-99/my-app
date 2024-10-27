export type TipoAluno = {
  id: number;
  nome: string;
  idade: number;
  foto: string;
  descricao: string;
  hardSkills: string[];
  softSkills: string[];
  materias: Materia[];
}

export type  Materia = {
  id: number;
  nome: string;
  checkpoints: Checkpoint[];
  challenges: Challenge[];
  globalSolutions: GlobalSolution[];
}

export type Checkpoint = {
  id: number;
  data: string;
  nota: number;
  feedback: string;
}

export type Challenge = {
  id: number;
  nota: number;
  descricao: string;
}

export type  GlobalSolution = {
  id: number;
  link: string;
  nota: number;
  descricao: string;
}
  