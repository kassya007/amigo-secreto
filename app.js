let listaAmigos = [];
let tentativas = 0; // Contador de tentativas
let amigoAnterior = ''; // Para armazenar o nome sorteado anteriormente
let amigoSorteadoAtual = ''; // Para armazenar o nome atual sorteado

// Função para adicionar nome ao clicar no botão "Adicionar Nome"
function adicionarNome() {
    const nome = document.getElementById("nomePessoa").value.trim();

    // Verificar se o nome não está vazio e se não foi adicionado anteriormente
    if (nome && !listaAmigos.includes(nome.toLowerCase())) {
        listaAmigos.push(nome.toLowerCase());
        atualizarLista();
    }
    document.getElementById("nomePessoa").value = ''; // Limpar campo após adicionar
}

// Função para adicionar a lista de nomes (com vírgulas) ao clicar no botão "Adicionar Lista"
function adicionarLista() {
    const lista = document.getElementById("listaAmigos").value.trim();
    const nomes = lista.split(',').map(nome => nome.trim().toLowerCase()).filter(nome => nome !== '');

    nomes.forEach(nome => {
        if (!listaAmigos.includes(nome)) {
            listaAmigos.push(nome);
        }
    });

    atualizarLista();
    gerarLinkUnico();
    document.getElementById("listaAmigos").value = ''; // Limpar campo após adicionar
}

// Função para atualizar a lista de amigos na tela
function atualizarLista() {
    const listaDisplay = document.getElementById("listaDisplay");
    listaDisplay.innerHTML = ''; // Limpar lista atual
    listaAmigos.forEach(nome => {
        const li = document.createElement("li");
        li.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
        listaDisplay.appendChild(li);
    });
}

// Função para gerar o link único para compartilhamento
function gerarLinkUnico() {
    const hash = btoa(JSON.stringify(listaAmigos)); // Gerar hash da lista
    const link = `${window.location.href}?lista=${hash}`;
    document.getElementById("linkShare").innerHTML = `<strong>Link para Compartilhar:</strong> <a href="${link}" target="_blank">${link}</a>`;
}

// Função para carregar a lista de amigos a partir da URL
function carregarListaDaURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const listaHash = urlParams.get('lista');

    if (listaHash) {
        try {
            // Decodificar o hash e carregar a lista
            listaAmigos = JSON.parse(atob(listaHash));
            atualizarLista(); // Atualizar a lista na tela
        } catch (e) {
            console.error("Erro ao carregar a lista do link", e);
        }
    }
}

// Função para sortear o amigo secreto
function sortearAmigo() {
    const nomePessoa = document.getElementById("nomePessoa").value.trim().toLowerCase();

    // Verificar se o nome da pessoa foi fornecido e está na lista
    if (!nomePessoa || !listaAmigos.includes(nomePessoa)) {
        alert("Por favor, adicione seu nome na lista.");
        return;
    }

    // Remover o nome da pessoa que está acessando para evitar que ela tire a si mesma
    const listaDisponivel = listaAmigos.filter(nome => nome !== nomePessoa.toLowerCase());

    if (listaDisponivel.length === 0) {
        alert("Não há amigos para sortear.");
        return;
    }

    // Caso já tenha feito 3 tentativas, mostrar a mensagem de confirmação
    if (tentativas > 0) {
        const mensagemTentativas = document.getElementById("tentativaMessage");
        mensagemTentativas.style.display = "block";
        return;
    }

    // Sortear o amigo secreto
    amigoAnterior = amigoSorteadoAtual; // Armazenar o sorteio anterior
    amigoSorteadoAtual = listaDisponivel[Math.floor(Math.random() * listaDisponivel.length)];
    const resultado = document.getElementById("resultado");

    resultado.textContent = `Seu amigo secreto é: ${amigoSorteadoAtual.charAt(0).toUpperCase() + amigoSorteadoAtual.slice(1)}`;
    tentativas += 1; // Incrementar o contador de tentativas
}

// Função para mostrar o prompt e rodar novamente
function verificarRodadaNovamente() {
    const confirmacao = window.confirm("Você tirou seu marido, esposa ou filho? Gostaria de rodar novamente?");
    if (confirmacao) {
        tentativas = 0; // Resetar tentativas para que a pessoa possa rodar novamente
        sortearAmigo(); // Sortear novamente
    } else {
        // Repetir o sorteio original
        const resultado = document.getElementById("resultado");
        resultado.textContent = `Seu amigo secreto é: ${amigoAnterior.charAt(0).toUpperCase() + amigoAnterior.slice(1)}`;
        tentativas = 0; // Resetar tentativas
    }
}

// Verificar a URL ao carregar a página
window.onload = function() {
    carregarListaDaURL();
};
