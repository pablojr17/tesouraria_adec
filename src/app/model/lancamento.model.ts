export interface Lancamento {
  data: string;
  descricao: string;
  valor: number;
  origem: string;
  categoria?: string;
}

export interface LancamentoSup {
  id?: string;
  tipo: 'ENTRADA' | 'SAIDA';
  descricao?: string;
  valor: number;
  data: string; // yyyy-mm-dd
  origem?: string;
  // ENTRADA
  natureza_entrada?: 'DIZIMO' | 'OFERTA';
  // apenas SAÍDA
  categoria?: string | null;
  grupo?: string | null;
  numero_nota?: string | null;

  created_at?: string | null;
}
