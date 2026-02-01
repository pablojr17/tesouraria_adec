import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LancamentoService } from './service/lancamento.service';
import { EntradasComponent } from './components/entradas/entradas.component';
import { SaidasComponent } from './components/saidas/saidas.component';
import { CommonModule } from '@angular/common';
import { entradas, saidas } from '../../db.json'
import { Lancamento } from './model/lancamento.model';
import { LancamentosComponent } from './components/lancamentos/lancamentos.component';
import { LancamentosTableComponent } from './components/lancamentos-table/lancamentos-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EntradasComponent, SaidasComponent, CommonModule, LancamentosComponent, LancamentosTableComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    abaSelecionada = 'entradas';
  saldo: number = 0;
entradas: Lancamento[] = []; // seus dados de entrada
saidas: Lancamento[] = [];   // seus dados de saída
totalEntradas = 0;
totalSaidas = 0;
entradasSede = 0;
saidasSede = 0;

entradasJupagua = 0;
saidasJupagua = 0;

entradasVilaSantana = 0;
saidasVilaSantana = 0;

entradasRioGrande2 = 0;
saidasRioGrande2 = 0;
  constructor(private service: LancamentoService) {}

  ngOnInit(): void {
    this.atualizarSaidas()
    this.atualizarSaldo();
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
    this.atualizarSaldo(); // opcional: se quiser recalcular ao trocar abas
  }

atualizarSaldo() {
  // Função auxiliar para somar valores por local
  const somaPorLocal = (lancamentos: Lancamento[], local: string) =>
    lancamentos
      .filter(l => l.origem === local)
      .reduce((acc, l) => acc + l.valor, 0);

  this.entradasSede = somaPorLocal(this.entradas, 'SEDE');
  this.saidasSede = somaPorLocal(this.saidas, 'SEDE');

  this.entradasJupagua = somaPorLocal(this.entradas, 'Jupagua');
  this.saidasJupagua = somaPorLocal(this.saidas, 'Jupagua');

  this.entradasVilaSantana = somaPorLocal(this.entradas, 'Vila Santana');
  this.saidasVilaSantana = somaPorLocal(this.saidas, 'Vila Santana');

  this.entradasRioGrande2 = somaPorLocal(this.entradas, 'Rio Grande II');
  this.saidasRioGrande2 = somaPorLocal(this.saidas, 'Rio Grande II');

  this.totalEntradas = this.entradas.reduce((acc, e) => acc + e.valor, 0);
  this.totalSaidas = this.saidas.reduce((acc, s) => acc + s.valor, 0);
  this.saldo = (this.totalEntradas + 2693.66) - this.totalSaidas;
}

  atualizarSaidas(): void {
    this.saidas = saidas;
    this.entradas = entradas;
  }

}
