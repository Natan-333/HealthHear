import { IDocument } from './IDocument';
import { IUser } from './IUser';

export interface IFeedback {
  id: number | null;
  data: string | Date;
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
