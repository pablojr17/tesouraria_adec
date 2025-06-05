import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Import OnInit
import { FormsModule } from '@angular/forms';
import { Lancamento } from '../../model/lancamento.model';
import { LancamentoService } from '../../service/lancamento.service';

@Component({
  selector: 'app-saidas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.scss'
})
export class SaidasComponent implements OnInit { // Implement OnInit

  // Use specific names for 'saida' related input fields
  descricaoSaida: string = '';
  valorSaida: number = 0;
  dataSaida: string = '';

  saidas: Lancamento[] = [];

  constructor(private lancamentoService: LancamentoService) {
    // Constructor is generally for dependency injection.
    // Initial data fetching should ideally be in ngOnInit.
  }

  ngOnInit(): void {
    // Fetch initial data when the component initializes
    this.atualizarSaidas();
  }

  adicionarSaida(): void {
    // Check for valid input
    if (!this.descricaoSaida || this.valorSaida <= 0 || !this.dataSaida) {
      alert('Por favor, preencha todos os campos da saída corretamente (descrição, valor maior que 0 e data).');
      return;
    }

    const novaSaida: Lancamento = {
      descricao: this.descricaoSaida,
      valor: this.valorSaida,
      data: this.dataSaida,
    };

    // Use the service to add the new expense
    this.lancamentoService.addSaida(novaSaida).subscribe({
      next: () => {
        // Clear input fields on successful addition
        this.descricaoSaida = '';
        this.valorSaida = 0;
        this.dataSaida = '';
        // Refresh the list of expenses from the service
        this.atualizarSaidas();
      },
      error: (err) => {
        console.error('Erro ao adicionar saída:', err);
        alert('Ocorreu um erro ao adicionar a saída. Tente novamente.');
      }
    });
  }

  atualizarSaidas(): void {
    // Use the service to get the list of expenses
    this.lancamentoService.getSaidas().subscribe({
      next: (data) => {
        console.log('Saídas carregadas:', data);
        this.saidas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar saídas:', err);
        // Optionally display an error message to the user
      }
    });
  }

  /**
   * Calculates the total value of all expenses.
   * This method is used in the HTML to display the sum.
   */
  getTotalSaidas(): number {
    return this.saidas.reduce((total, saida) => total + saida.valor, 0);
  }
}
