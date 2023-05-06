const add = document.getElementById('add');
const body = document.querySelector('body');
const search = document.getElementById('search');

class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDespesa() {
    for (let i in this) {
      let not = ['', undefined, null];
      if (not.includes(this[i])) {
        return false
      }
    }
    return true
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem('id');
    if (id === null || id === undefined || Number.isNaN(Number(id))) {
      localStorage.setItem('id', '0');
    }
  }

  getProximoId() {
    let proximoId = parseInt(localStorage.getItem('id'));
    if (isNaN(proximoId)) {
      localStorage.setItem('id', '0');
      proximoId = 0;
    }
    return proximoId + 1;
  }


  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem('id', id);
    this.sucessoGravar(d)
  }

  sucessoGravar(d) {
    let { modal_header, titulo, mensagem_modal, voltar } = {
      modal_header: document.getElementById('modal-header'),
      titulo: document.getElementById('titulo-modal'),
      mensagem_modal: document.getElementById('mensagem-modal'),
      voltar: document.getElementById('voltar'),
    }
    modal_header.classList.add('text-success');
    modal_header.classList.remove('text-danger');
    titulo.innerText = 'Registro inserido com sucesso!';
    mensagem_modal.innerText = 'Despesa foi cadastrada com sucesso!'
    voltar.classList.add('btn-success');
    voltar.classList.remove('btn-danger');
    for (let prop in d) {
      document.getElementById(prop.replace("_", "-")).value = '';
    }
    $('#modal-aviso').modal('show');
  }

  erroGravar(d) {
    let { modal_header, titulo, mensagem_modal, voltar } = {
      modal_header: document.getElementById('modal-header'),
      titulo: document.getElementById('titulo-modal'),
      mensagem_modal: document.getElementById('mensagem-modal'),
      voltar: document.getElementById('voltar'),
    }
    modal_header.classList.add('text-danger');
    modal_header.classList.remove('text-success');
    titulo.innerText = 'Erro ao cadastrar!';
    mensagem_modal.innerText = 'Verifique os itens e tente novamente.';
    voltar.classList.add('btn-danger');
    voltar.classList.remove('btn-success');
    $('#modal-aviso').modal('show');
    throw new Error(`Dados inacessiveis ou não existentes \n ${d}`);
  }

  recuperarTodosRegistros() {
    let id = localStorage.getItem('id');
    let despesas = [];
    for (let i = 0; i < id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));

      despesas.push(despesa);
    }
    console.log(despesas);
    return despesas
  }

  remover(indice) {
    localStorage.removeItem(indice);
      carregaListaDespesas();

  }

  pesquisar() {}
}
const bd = new Bd();

function cadastrarDespesa() {

  let ano = document.getElementById('ano');
  let mes = document.getElementById('mes');
  let dia = document.getElementById('dia');
  let tipo = document.getElementById('tipo');
  let descricao = document.getElementById('descricao');
  let valor = document.getElementById('valor');

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value,
  );

  despesa.validarDespesa() ? bd.gravar(despesa) : bd.erroGravar(despesa);
}

function carregaListaDespesas() {
  console.log('função carregada')
  let despesas = bd.recuperarTodosRegistros();
    let lista = document.getElementById('lista-despesas');
    let indicex = 0;
    lista.innerHTML = '';
    despesas.forEach((despesa) => {
      lista.innerHTML += `<tr id="${indicex}">
      <td>${despesa.ano}</td>
      <td>${despesa.mes}</td>
      <td>${despesa.dia}</td>
      <td>${despesa.tipo}</td>
      <td>${despesa.descricao}</td>
      <td>${despesa.valor}</td>
      <td><button class="btn btn-danger" onclick="removerDespesa(${indicex})">Remover</button></td>
      </tr>`;
    });
}

function removerDespesa(indice) {
  bd.remover(indice);
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value;
  let mes = document.getElementById('mes').value;
  let dia = document.getElementById('dia').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  bd.pesquisar(despesa);

}

window.addEventListener('load', carregaListaDespesas);
add.addEventListener('click', cadastrarDespesa);
search.addEventListener('click', pesquisarDespesa);