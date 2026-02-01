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
}
