import { Component, OnInit } from '@angular/core';
import { LancamentosService } from '../../service/lancamentos.service';
import { CommonModule } from '@angular/common';
import { LancamentoSup } from '../../model/lancamento.model';


interface LinhaRelatorio {
  data: string;
  dizimos: number;
  ofertas: number;
  total: number;
}

@Component({
  selector: 'app-lancamentos-table',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './lancamentos-table.component.html',
  styleUrls: ['./lancamentos-table.component.scss'],
})
export class LancamentosTableComponent implements OnInit {
  relatorio: LinhaRelatorio[] = [];

  constructor(private service: LancamentosService) {}

async ngOnInit() {
  const lancamentos = await this.service.buscarEntradas();
  this.relatorio = this.gerarRelatorioPorData(lancamentos);
}


  montarRelatorio(lancamentos: any[]) {
    const mapa = new Map<string, LinhaRelatorio>();

    for (const l of lancamentos) {
      const data = l.data;

      if (!mapa.has(data)) {
        mapa.set(data, {
          data,
          dizimos: 0,
          ofertas: 0,
          total: 0,
        });
      }

      const linha = mapa.get(data)!;

      if (l.subtipo === 'DIZIMO') {
        linha.dizimos += l.valor;
      }

      if (l.subtipo === 'OFERTA') {
        linha.ofertas += l.valor;
      }

      linha.total = linha.dizimos + linha.ofertas;
    }

    this.relatorio = Array.from(mapa.values());
  }

get totalReceitas() {
  return this.relatorio.reduce((sum, r) => sum + r.total, 0);
}


  gerarRelatorioPorData(lancamentos: LancamentoSup[]) {
  return Object.values(
    lancamentos.reduce((acc, item) => {
      const data = item.data;

      if (!acc[data]) {
        acc[data] = {
          data,
          dizimos: 0,
          ofertas: 0,
          total: 0,
        };
      }

      if (item.natureza_entrada === 'DIZIMO') {
        acc[data].dizimos += item.valor;
      }

      if (item.natureza_entrada === 'OFERTA') {
        acc[data].ofertas += item.valor;
      }

      acc[data].total = acc[data].dizimos + acc[data].ofertas;

      return acc;
    }, {} as Record<string, any>)
  );
}

}
