import { Component, OnInit } from '@angular/core'; // Import OnInit
import { LancamentoService } from '../../service/lancamento.service';
import { Lancamento } from '../../model/lancamento.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {entradas} from '../../../../db.json'
@Component({
  selector: 'app-entradas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.scss'
})
export class EntradasComponent implements OnInit { // Implement OnInit

  // Use specific names for 'entrada' related input fields
  descricaoEntrada: string = '';
  valorEntrada: number = 0;
  dataEntrada: string = '';
  entradas: Lancamento[] = entradas; // Array to hold your income objects
  isLocalhost: boolean = true

  constructor(private service: LancamentoService) {
    // Constructor is primarily for dependency injection.
    // Initial data fetching should ideally be in ngOnInit.
  }

  ngOnInit(): void {
    // Fetch initial data when the component initializes
    this.atualizarLista();
    this.isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  }

  adicionarEntrada(): void { // Renamed for clarity and consistency
    // Validate inputs: ensure all fields are filled and value is positive
    if (!this.descricaoEntrada || this.valorEntrada <= 0 || !this.dataEntrada) {
      // Use a more user-friendly alert or a modal instead of browser's alert in a real app
      alert('Por favor, preencha todos os campos da entrada corretamente (descrição, valor maior que 0 e data).');
      return;
    }

    const novaEntrada: Lancamento = {
      descricao: this.descricaoEntrada, // Use the specific input variable
      valor: this.valorEntrada,         // Use the specific input variable
      data: this.dataEntrada,           // Use the specific input variable
    };

    // Use the service to add the new income entry
    this.service.addEntrada(novaEntrada).subscribe({
      next: () => {
        // Clear input fields on successful addition
        this.descricaoEntrada = '';
        this.valorEntrada = 0;
        this.dataEntrada = '';
        // Refresh the list of income entries from the service
        this.atualizarLista();
      },
      error: (err) => {
        console.error('Erro ao adicionar entrada:', err);
        alert('Ocorreu um erro ao adicionar a entrada. Tente novamente.');
      }
    });
  }

atualizarLista(): void {
 this.entradas = entradas;
}

  /**
   * Calculates the total value of all income entries.
   * This method is used in the HTML to display the sum in the table footer.
   */
  getTotalEntradas(): number {
    return this.entradas.reduce((total, entrada) => total + entrada.valor, 0);
  }
}
