import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LancamentosService } from '../../service/lancamentos.service';
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
  imports: [CommonModule],
  templateUrl: './lancamentos-table.component.html',
  styleUrls: ['./lancamentos-table.component.scss'],
})
export class LancamentosTableComponent implements OnChanges {
  @Input() dataInicio!: string;
  @Input() dataFim!: string;

  relatorio: LinhaRelatorio[] = [];

  constructor(private service: LancamentosService) {}

  async ngOnChanges() {
    if (!this.dataInicio || !this.dataFim) return;

    const lancamentos =
      await this.service.buscarEntradasPorPeriodo(
        this.dataInicio,
        this.dataFim
      );

    this.relatorio = this.gerarRelatorioPorData(lancamentos);
  }

  gerarRelatorioPorData(lancamentos: LancamentoSup[]): LinhaRelatorio[] {
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
          acc[data].dizimos += Number(item.valor);
        }

        if (item.natureza_entrada === 'OFERTA') {
          acc[data].ofertas += Number(item.valor);
        }

        acc[data].total = acc[data].dizimos + acc[data].ofertas;

        return acc;
      }, {} as Record<string, LinhaRelatorio>)
    );
  }

  get totalReceitas() {
    return this.relatorio.reduce((sum, r) => sum + r.total, 0);
  }
}
