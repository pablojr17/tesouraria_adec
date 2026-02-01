import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LancamentosComponent } from './components/lancamentos/lancamentos.component';
import { LancamentosTableComponent } from './components/lancamentos-table/lancamentos-table.component';
import { LancamentosService } from './service/lancamentos.service';
import { LancamentoSup } from './model/lancamento.model';

interface MesOption {
  label: string;
  mes: number; // 0-11
  ano: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    LancamentosComponent,
    LancamentosTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  /** ============================
   * CONTROLE DE MÊS
   * ============================ */
  meses: MesOption[] = [
    { label: 'Janeiro / 2026', mes: 0, ano: 2026 },
    { label: 'Fevereiro / 2026', mes: 1, ano: 2026 },
    { label: 'Março / 2026', mes: 2, ano: 2026 },
    { label: 'Abril / 2026', mes: 3, ano: 2026 },
    { label: 'Maio / 2026', mes: 4, ano: 2026 },
    { label: 'Junho / 2026', mes: 5, ano: 2026 },
    { label: 'Julho / 2026', mes: 6, ano: 2026 },
    { label: 'Agosto / 2026', mes: 7, ano: 2026 },
    { label: 'Setembro / 2026', mes: 8, ano: 2026 },
    { label: 'Outubro / 2026', mes: 9, ano: 2026 },
    { label: 'Novembro / 2026', mes: 10, ano: 2026 },
    { label: 'Dezembro / 2026', mes: 11, ano: 2026 },
  ];

  mesSelecionado!: MesOption;

  /** ============================
   * RESUMO FINANCEIRO
   * ============================ */
  entradasSede = 0;
  saidasSede = 0;

  entradasJupagua = 0;
  saidasJupagua = 0;

  entradasVilaSantana = 0;
  saidasVilaSantana = 0;

  entradasRioGrande2 = 0;
  saidasRioGrande2 = 0;

  totalEntradas = 0;
  totalSaidas = 0;

  saldoAnterior = 0;
  saldo = 0;

  constructor(private lancamentoService: LancamentosService) {}

  async ngOnInit() {
    const hoje = new Date();

    this.mesSelecionado =
      this.meses.find(
        m => m.mes === hoje.getMonth() && m.ano === hoje.getFullYear()
      ) || this.meses[0];

    await this.atualizarTudo();
  }

  /** ============================
   * TROCA DE MÊS
   * ============================ */
  async onMesChange() {
    await this.atualizarTudo();
  }

  private async atualizarTudo() {
    await this.carregarSaldoAnterior();
    await this.carregarDadosMesAtual();
  }

  /** ============================
   * MÊS ATUAL
   * ============================ */
  private async carregarDadosMesAtual() {
    const inicio = new Date(
      this.mesSelecionado.ano,
      this.mesSelecionado.mes,
      1
    ).toISOString().split('T')[0];

    const fim = new Date(
      this.mesSelecionado.ano,
      this.mesSelecionado.mes + 1,
      0
    ).toISOString().split('T')[0];

    const lancamentos =
      await this.lancamentoService.buscarLancamentosPorPeriodo(inicio, fim);

    this.calcularResumo(lancamentos);
  }

  /** ============================
   * SALDO ANTERIOR
   * ============================ */
  private async carregarSaldoAnterior() {
    const inicio = new Date(
      this.mesSelecionado.ano,
      this.mesSelecionado.mes - 1,
      1
    ).toISOString().split('T')[0];

    const fim = new Date(
      this.mesSelecionado.ano,
      this.mesSelecionado.mes,
      0
    ).toISOString().split('T')[0];

    const lancamentos =
      await this.lancamentoService.buscarLancamentosPorPeriodo(inicio, fim);

    let entradas = 0;
    let saidas = 0;

    lancamentos.forEach(l => {
      if (l.tipo === 'ENTRADA') entradas += Number(l.valor);
      if (l.tipo === 'SAIDA') saidas += Number(l.valor);
    });

    this.saldoAnterior = entradas - saidas;
  }

  /** ============================
   * REDUCE CENTRAL
   * ============================ */
private normalizarOrigem(origem?: string): string {
  if (!origem) return 'DESCONHECIDA';

  return origem
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
}


private calcularResumo(lancamentos: LancamentoSup[]) {

  const resumo = lancamentos.reduce((acc, l) => {
    const valor = Number(l.valor) || 0;
    if(l.origem) {}
    const origem = this.normalizarOrigem(l.origem);

    if (l.tipo === 'ENTRADA') {
      acc.totalEntradas += valor;
      acc.entradas[origem] = (acc.entradas[origem] || 0) + valor;
    }

    if (l.tipo === 'SAIDA') {
      acc.totalSaidas += valor;
      acc.saidas[origem] = (acc.saidas[origem] || 0) + valor;
    }

    return acc;
  }, {
    totalEntradas: 0,
    totalSaidas: 0,
    entradas: {},
    saidas: {}
  } as {
    totalEntradas: number;
    totalSaidas: number;
    entradas: Record<string, number>;
    saidas: Record<string, number>;
  });

  /* ===== ATRIBUIÇÕES ===== */

this.entradasSede = resumo.entradas['SEDE'] ?? 0;
this.saidasSede   = resumo.saidas['SEDE'] ?? 0;

this.entradasJupagua = resumo.entradas['JUPAGUA'] ?? 0;
this.saidasJupagua   = resumo.saidas['JUPAGUA'] ?? 0;

this.entradasVilaSantana = resumo.entradas['VILASANTANA'] ?? 0;
this.saidasVilaSantana   = resumo.saidas['VILASANTANA'] ?? 0;

this.entradasRioGrande2 = resumo.entradas['RIOGRANDEII'] ?? 0;
this.saidasRioGrande2   = resumo.saidas['RIOGRANDEII'] ?? 0;


  this.totalEntradas = resumo.totalEntradas;
  this.totalSaidas = resumo.totalSaidas;

  this.saldo = this.totalEntradas + this.saldoAnterior - this.totalSaidas;
}


  get totalComSaldoAnterior() {
    return this.totalEntradas + this.saldoAnterior;
  }

  get dataInicioMes() {
  return new Date(
    this.mesSelecionado.ano,
    this.mesSelecionado.mes,
    1
  ).toISOString().split('T')[0];
}

get dataFimMes() {
  return new Date(
    this.mesSelecionado.ano,
    this.mesSelecionado.mes + 1,
    0
  ).toISOString().split('T')[0];
}

}
