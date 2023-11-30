import { IDocument } from './IDocument';
import { IUser } from './IUser';

export interface IFeedback {
  id: number;
  data: string;
  titulo: string;
  descricao: string;
  nota: number;
  paciente: IUser;
  registro: IDocument;
  isAnonimo: boolean;
  acao?: string | null;
  imagem?: string | null;
  tipo?: string;
}
