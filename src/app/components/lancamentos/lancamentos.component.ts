import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { LancamentosService } from '../../service/lancamentos.service';

@Component({
  selector: 'app-lancamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lancamentos.component.html',
  styleUrl: './lancamentos.component.scss',
})
export class LancamentosComponent implements OnInit {
  @Input() dataInicio!: string;
    @Input() dataFim!: string;

  lancamentos: any[] = [];
filtroCategoria = '';
filtroGrupo = '';
filtroOrigem = '';
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
  cpf_cnpj: [''],
  grupo: [''],
  numero_nota: [''],
});



  constructor(
    private service: LancamentosService
  ) {}

 async ngOnInit() {
  await this.carregarLancamentos();
}

async ngOnChanges() {
  await this.carregarLancamentos();
}

async carregarLancamentos() {
  if (!this.dataInicio || !this.dataFim) return;

  this.lancamentos = await this.service.buscarPorPeriodo(
    this.dataInicio,
    this.dataFim
  );
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
      numero_nota: null,
      cpf_cnpj: null,
    });
  }

  if (tipo === 'SAIDA') {
    this.form.patchValue({
      natureza_entrada: undefined,
    });
  }

await this.service.criar(this.form.value as any);
  this.carregarLancamentos();

  this.form.reset({
    tipo: 'ENTRADA',
    data: new Date().toISOString().substring(0, 10),
  });
}

get entradas() {
  return this.lancamentos.filter(l => l.tipo === 'ENTRADA');
}

get saidasFiltradas() {
  return this.lancamentos
    .filter(l => l.tipo === 'SAIDA')
    .filter(l =>
      (!this.filtroCategoria || l.categoria === this.filtroCategoria) &&
      (!this.filtroGrupo || l.grupo === this.filtroGrupo) &&
      (!this.filtroOrigem || l.origem === this.filtroOrigem)
    );
}

get saidasAgrupadasPorGrupo() {
  const grupos: Record<string, any[]> = {};

  this.saidasFiltradas.forEach(l => {
    const grupo = l.grupo || 'Sem Grupo';

    if (!grupos[grupo]) {
      grupos[grupo] = [];
    }

    grupos[grupo].push(l);
  });

  return Object.entries(grupos);
}

getTotalGrupo(lancamentos: any[]) {
  return lancamentos.reduce((acc, l) => acc + l.valor, 0);
}


}
