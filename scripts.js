const formulario = document.getElementById("formulario-cadastro");
const botaoLimpar = document.getElementById("botao-limpar");
const mensagem = document.getElementById("mensagem");

const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    telefone: document.getElementById("telefone"),
    cep: document.getElementById("cep"),
    logradouro: document.getElementById("logradouro"),
    numero: document.getElementById("numero"),
    complemento: document.getElementById("complemento"),
    bairro: document.getElementById("bairro"),
    cidade: document.getElementById("cidade"),
    estado: document.getElementById("estado")
};

const chaveStorage = "cadastroUsuarioEBAC";

function limparCep(cep) {
    return cep.replace(/\D/g, "");
}

function salvarDados() {
    const dados = {};

    Object.keys(campos).forEach(function(campo) {
        dados[campo] = campos[campo].value;
    });

    localStorage.setItem(chaveStorage, JSON.stringify(dados));
}

function restaurarDados() {
    const dadosSalvos = localStorage.getItem(chaveStorage);

    if (!dadosSalvos) {
        return;
    }

    const dados = JSON.parse(dadosSalvos);

    Object.keys(campos).forEach(function(campo) {
        if (dados[campo]) {
            campos[campo].value = dados[campo];
        }
    });

    mensagem.textContent = "Dados restaurados do armazenamento local.";
}

function preencherEndereco(endereco) {
    campos.logradouro.value = endereco.logradouro || "";
    campos.bairro.value = endereco.bairro || "";
    campos.cidade.value = endereco.localidade || "";
    campos.estado.value = endereco.uf || "";

    salvarDados();
}

async function buscarEnderecoPorCep() {
    const cep = limparCep(campos.cep.value);

    if (cep.length !== 8) {
        mensagem.textContent = "Digite um CEP válido com 8 números.";
        return;
    }

    try {
        mensagem.textContent = "Buscando endereço...";

        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = await resposta.json();

        if (endereco.erro) {
            mensagem.textContent = "CEP não encontrado.";
            return;
        }

        preencherEndereco(endereco);
        mensagem.textContent = "Endereço preenchido automaticamente.";
    } catch (erro) {
        mensagem.textContent = "Erro ao buscar o CEP. Verifique sua conexão.";
        console.error("Erro ao buscar CEP:", erro);
    }
}

Object.keys(campos).forEach(function(campo) {
    campos[campo].addEventListener("input", salvarDados);
});

campos.cep.addEventListener("blur", buscarEnderecoPorCep);

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    salvarDados();
    mensagem.textContent = "Cadastro salvo no armazenamento local.";
});

botaoLimpar.addEventListener("click", function() {
    localStorage.removeItem(chaveStorage);
    formulario.reset();
    mensagem.textContent = "Dados removidos do armazenamento local.";
});

restaurarDados();