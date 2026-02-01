import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LancamentosService } from '../../service/lancamentos.service';

@Component({
  selector: 'app-lancamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lancamentos.component.html',
  styleUrl: './lancamentos.component.scss',
})
export class LancamentosComponent implements OnInit {
  lancamentos: any[] = [];

   private fb = inject(FormBuilder);

 form = this.fb.group({
  tipo: ['ENTRADA'],
  descricao: [''],
  valor: [0],
  data: [new Date().toISOString().substring(0, 10)],
  origem: [''],

  // ENTRADA
  natureza_entrada: [''],

  // SAÍDA
  categoria: [''],
  grupo: [''],
  numero_nota: [''],
});



  constructor(
    private service: LancamentosService
  ) {}

  async ngOnInit() {
    this.lancamentos = await this.service.listar();
  }

async salvar() {
  if (this.form.invalid) return;

  const tipo = this.form.value.tipo;

  if (tipo === 'ENTRADA' && !this.form.value.natureza_entrada) {
    alert('Selecione se é dízimo ou oferta');
    return;
  }

  if (tipo === 'ENTRADA') {
    this.form.patchValue({
      categoria: null,
      grupo: null,
      numero_nota: undefined,
    });
  }

  if (tipo === 'SAIDA') {
    this.form.patchValue({
      natureza_entrada: undefined,
    });
  }

await this.service.criar(this.form.value as any);
  this.lancamentos = await this.service.listar();

  this.form.reset({
    tipo: 'ENTRADA',
    data: new Date().toISOString().substring(0, 10),
  });
}


}
