import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { LancamentoSup } from '../model/lancamento.model';

@Injectable({ providedIn: 'root' })
export class LancamentosService {
  constructor(private supabase: SupabaseService) {}

  async listar(): Promise<LancamentoSup[]> {
    const { data, error } = await this.supabase.client
      .from('lancamentos')
      .select('*')
      .order('data', { ascending: false });

    if (error) throw error;
    return data as LancamentoSup[];
  }

  async criar(lancamento: LancamentoSup) {
    const { error } = await this.supabase.client
      .from('lancamentos')
      .insert(lancamento);

    if (error) throw error;
  }

   async buscarEntradas() {
    const { data, error } = await this.supabase.client
      .from('lancamentos')
      .select('*')
      .eq('tipo', 'ENTRADA')
      .order('data', { ascending: true });

    if (error) throw error;
    return data;
  }

  async buscarLancamentosPorPeriodo(
    inicio: string,
    fim: string
  ): Promise<LancamentoSup[]> {
    const { data, error } = await this.supabase.client
      .from('lancamentos')
      .select('*')
      .gte('data', inicio)
      .lte('data', fim);

    if (error) {
      console.error('Erro ao buscar lançamentos:', error);
      throw error;
    }

    return data as LancamentoSup[];
  }

  async buscarEntradasPorPeriodo(inicio: string, fim: string) {
  const { data, error } = await this.supabase.client
    .from('lancamentos')
    .select('*')
    .eq('tipo', 'ENTRADA')
    .gte('data', inicio)
    .lte('data', fim)
    .order('data');

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

async buscarPorPeriodo(
  inicio: string,
  fim: string
): Promise<LancamentoSup[]> {
  const { data, error } = await this.supabase.client
    .from('lancamentos')
    .select('*')
    .gte('data', inicio)
    .lte('data', fim)
    .order('data', { ascending: true });

  if (error) throw error;
  return data as LancamentoSup[];
}


}
