const btn = document.getElementsByClassName("btn-remove");
const add = document.getElementById("add");
const body = document.querySelector("body");
const search = document.getElementById("search");
let lista = document.getElementById("lista-despesas");

class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDespesa() {
    for (let i in this) {
      let not = ["", undefined, null];
      if (not.includes(this[i])) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");
    if (id === null || id === undefined || Number.isNaN(Number(id))) {
      localStorage.setItem("id", "0");
    }
  }

  getProximoId() {
    let proximoId = parseInt(localStorage.getItem("id"));
    if (isNaN(proximoId)) {
      localStorage.setItem("id", "0");
      proximoId = 0;
    }
    return proximoId + 1;
  }

  gravar(d) {
    this.ordenar();
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
    this.sucessoGravar(d);
  }

  sucessoGravar(d) {
    let { modal_header, titulo, mensagem_modal, voltar } = {
      modal_header: document.getElementById("modal-header"),
      titulo: document.getElementById("titulo-modal"),
      mensagem_modal: document.getElementById("mensagem-modal"),
      voltar: document.getElementById("voltar"),
    };
    modal_header.classList.add("text-success");
    modal_header.classList.remove("text-danger");
    titulo.innerText = "Registro inserido com sucesso!";
    mensagem_modal.innerText = "Despesa foi cadastrada com sucesso!";
    voltar.classList.add("btn-success");
    voltar.classList.remove("btn-danger");
    for (let prop in d) {
      document.getElementById(prop.replace("_", "-")).value = "";
    }
    $("#modal-aviso").modal("show");
  }

  erroGravar(d) {
    let { modal_header, titulo, mensagem_modal, voltar } = {
      modal_header: document.getElementById("modal-header"),
      titulo: document.getElementById("titulo-modal"),
      mensagem_modal: document.getElementById("mensagem-modal"),
      voltar: document.getElementById("voltar"),
    };
    modal_header.classList.add("text-danger");
    modal_header.classList.remove("text-success");
    titulo.innerText = "Erro ao cadastrar!";
    mensagem_modal.innerText = "Verifique os itens e tente novamente.";
    voltar.classList.add("btn-danger");
    voltar.classList.remove("btn-success");
    $("#modal-aviso").modal("show");
    throw new Error(`Dados inacessiveis ou não existentes \n ${d}`);
  }
  async ordenar() {
    // Passo 1: Obter as chaves do localStorage
    const keys = Object.keys(localStorage);

    // Passo 2: Ordenar as chaves em ordem crescente
    keys.sort((a, b) => parseInt(a) - parseInt(b));

    // Passo 3: Criar um novo objeto para armazenar os valores na ordem das chaves ordenadas
    const sortedLocalStorage = {};

    // Passo 4: Copiar os valores correspondentes para o novo objeto
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      sortedLocalStorage[key] = localStorage.getItem(key);
    }

    // Passo 5: Armazenar o novo objeto no localStorage
    localStorage.clear();
    for (const [key, value] of Object.entries(sortedLocalStorage)) {
      localStorage.setItem(key, value);
    }
  }

  recuperarTodosRegistros() {
    this.ordenar();
    let id = parseInt(localStorage.getItem("id"));
    let despesas = [];
    for (let i = 0; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa === null) {
        continue;
      }
      despesas.push(despesa);
    }
    return despesas;
  }

  remover(id) {
    //    localStorage.removeItem(id);
    console.log(id);
  }

  pesquisar() {}
}
const bd = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  despesa.validarDespesa() ? bd.gravar(despesa) : bd.erroGravar(despesa);
}

async function carregaListaDespesas() {
  await bd.ordenar();
  let despesas = bd.recuperarTodosRegistros();
  let lista = document.getElementById("lista-despesas");
  let indice = 1;
  lista.innerHTML = "";
  despesas.forEach((despesa) => {
    let mes = despesa.mes;
    let dia = despesa.dia;
    if (mes.length == 1) {
      mes = mes.toString().padStart(2, "0");
    }
    if (dia.length == 1) {
      dia = dia.toString().padStart(2, "0");
    }

    lista.innerHTML += `<tr id="${indice}">
      <td>${despesa.dia.trim()}/${mes.trim()}/${despesa.ano.trim()}</td>
      <td>${despesa.tipo.trim()}</td>
      <td>${despesa.descricao.trim()}</td>
      <td>${despesa.valor.trim()}</td>
      <td><button class="btn btn-danger btn-remove" id="btn-${indice}">Remover</button></td>
      </tr>`;
    indice++;
  });
}

lista.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("btn-remove")) {
    let id = event.target.parentNode.parentNode.id;
    //   bd.remover(id); // Remove do banco
    event.target.parentNode.parentNode.remove();
    console.log(`Botão clicado: ${event.target.parentNode.parentNode.id}`);
  } else {
    return;
  }
});

function pesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  bd.pesquisar(despesa);
}

window.addEventListener("load", carregaListaDespesas);
add.addEventListener("click", cadastrarDespesa);
search.addEventListener("click", pesquisarDespesa);
