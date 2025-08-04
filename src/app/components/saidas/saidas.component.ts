import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Import OnInit
import { FormsModule } from '@angular/forms';
import { Lancamento } from '../../model/lancamento.model';
import { LancamentoService } from '../../service/lancamento.service';
import { saidas } from '../../../../db.json';

@Component({
  selector: 'app-saidas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.scss',
})
export class SaidasComponent implements OnInit {
  descricaoSaida: string = '';
  valorSaida: number = 0;
  dataSaida: string = '';
  isLocalhost: boolean = true;
  origem: string = '';
  origemSelecionada: string = 'TODOS';

  saidas: Lancamento[] = saidas;
  categoriaSaida: string = '';

  constructor(private lancamentoService: LancamentoService) {
    // Constructor is generally for dependency injection.
    // Initial data fetching should ideally be in ngOnInit.
  }

  ngOnInit(): void {
    this.isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // Fetch initial data when the component initializes
    this.atualizarSaidas();
  }

  adicionarSaida(): void {
    if (
      !this.descricaoSaida ||
      this.valorSaida <= 0 ||
      !this.dataSaida ||
      !this.categoriaSaida
    ) {
      alert(
        'Por favor, preencha todos os campos da saída corretamente (descrição, valor, data e categoria).'
      );
      return;
    }

    const novaSaida: Lancamento = {
      descricao: this.descricaoSaida,
      valor: this.valorSaida,
      data: this.dataSaida,
      origem: this.origem,
      categoria: this.categoriaSaida,
    };

    this.lancamentoService.addSaida(novaSaida).subscribe({
      next: () => {
        this.descricaoSaida = '';
        this.valorSaida = 0;
        this.dataSaida = '';
        this.categoriaSaida = '';
        this.atualizarSaidas();
      },
      error: (err) => {
        console.error('Erro ao adicionar saída:', err);
        alert('Ocorreu um erro ao adicionar a saída. Tente novamente.');
      },
    });
  }

  atualizarSaidas(): void {
    this.saidas = saidas;
  }

  saidasFiltradas() {
    if (this.origemSelecionada === 'TODOS') {
      return this.saidas;
    }
    return this.saidas.filter((s) => s.origem === this.origemSelecionada);
  }

  getTotalSaidas(): number {
    return this.saidasFiltradas().reduce(
      (total, saida) => total + saida.valor,
      0
    );
  }

  getSaidasAgrupadasPorCategoria() {
    const agrupadas: { [categoria: string]: any[] } = {};

    for (const saida of this.saidasFiltradas()) {
      const categoria = saida.categoria || 'Sem categoria';
      if (!agrupadas[categoria]) {
        agrupadas[categoria] = [];
      }
      agrupadas[categoria].push(saida);
    }

    return Object.entries(agrupadas); // [ [categoria, [saidas]], ... ]
  }

  getTotalPorCategoria(categoriaSaidas: any[]): number {
    return categoriaSaidas.reduce((soma, s) => soma + s.valor, 0);
  }
}
