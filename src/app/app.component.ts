import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LancamentoService } from './service/lancamento.service';
import { EntradasComponent } from './components/entradas/entradas.component';
import { SaidasComponent } from './components/saidas/saidas.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Lancamento } from './model/lancamento.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EntradasComponent, SaidasComponent, CommonModule, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    abaSelecionada = 'entradas';
  saldo: number = 0;

  constructor(private service: LancamentoService) {}

  ngOnInit(): void {
    this.atualizarSaldo();
  }

  selecionarAba(aba: string) {
    this.abaSelecionada = aba;
    this.atualizarSaldo(); // opcional: se quiser recalcular ao trocar abas
  }

  atualizarSaldo() {
    let entradasTotal = 0;
    let saidasTotal = 0;

    this.service.getEntradas().subscribe((entradas: Lancamento[]) => {
      entradasTotal = entradas.reduce((acc, e) => acc + e.valor, 0);

      this.service.getSaidas().subscribe((saidas: Lancamento[]) => {
        saidasTotal = saidas.reduce((acc, s) => acc + s.valor, 0);
        this.saldo = entradasTotal - saidasTotal;
      });
    });
  }
}
