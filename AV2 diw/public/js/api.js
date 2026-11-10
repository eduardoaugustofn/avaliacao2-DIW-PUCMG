// funções de acesso à API do JSON Server

async function pedir(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  if (!resposta.ok) {
    throw new Error("Erro na requisição: " + resposta.status);
  }
  return resposta.json();
}

function listarParticipantes() {
  return pedir("/participantes");
}

function listarNaRoca() {
  return pedir("/participantes?naRoca=true");
}

function listarForaDaRoca() {
  return pedir("/participantes?naRoca=false");
}

function listarVotos() {
  return pedir("/votos");
}

function registrarVoto(participanteId) {
  return pedir("/votos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participanteId: participanteId,
      data: new Date().toISOString()
    })
  });
}

async function zerarVotos() {
  const votos = await listarVotos();
  for (const voto of votos) {
    await fetch("/votos/" + voto.id, { method: "DELETE" });
  }
}

// devolve os participantes da roça com votos e percentual, do mais votado pro menos
function calcularResultado(naRoca, votos) {
  const total = votos.length;
  const lista = naRoca.map(function (p) {
    const qtd = votos.filter(function (v) {
      return v.participanteId === p.id;
    }).length;
    const percentual = total > 0 ? (qtd / total) * 100 : 0;
    return { id: p.id, nome: p.nome, foto: p.foto, votos: qtd, percentual: percentual };
  });
  lista.sort(function (a, b) {
    return b.votos - a.votos;
  });
  return lista;
}

function formatarPercentual(valor) {
  return valor.toFixed(1).replace(".", ",") + "%";
}
