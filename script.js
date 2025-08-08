document.addEventListener('DOMContentLoaded', () => {
  const sentimood = new Sentimood();

  const latidos = {
    positivo: [
      'https://actions.google.com/sounds/v1/animals/dog_bark_short.ogg',
      'https://actions.google.com/sounds/v1/animals/dog_bark.ogg',
    ],
    negativo: [
      'https://actions.google.com/sounds/v1/animals/dog_growl.ogg',
    ],
    neutro: [
      'https://actions.google.com/sounds/v1/animals/dog_whine.ogg',
    ]
  };

  function pegarLatido(score) {
    let lista = latidos.neutro;
    if (score > 0) lista = latidos.positivo;
    else if (score < 0) lista = latidos.negativo;
    return lista[Math.floor(Math.random() * lista.length)];
  }

  async function tocarLatidos(urls, intervalo = 800) {
    for (const url of urls) {
      const audio = new Audio(url);
      audio.play();
      await new Promise(res => {
        audio.onended = res;
        setTimeout(res, intervalo);
      });
    }
  }

  async function textoParaLatido() {
    const text = document.getElementById('inputText').value.trim();
    const statusDiv = document.getElementById('status');

    if (!text) {
      statusDiv.textContent = 'Por favor, digite algum texto.';
      return;
    }

    statusDiv.textContent = 'Analisando o texto...';

    const resultado = sentimood.analyze(text);
    const score = resultado.score;

    statusDiv.textContent = `Sentimento detectado: ${score > 0 ? 'Positivo' : score < 0 ? 'Negativo' : 'Neutro'}`;

    const palavras = text.split(/\s+/);
    const quantidadeLatidos = Math.min(5, Math.max(1, Math.floor(palavras.length / 5)));

    const urls = [];
    for (let i = 0; i < quantidadeLatidos; i++) {
      urls.push(pegarLatido(score));
    }

    statusDiv.textContent += ` — Tocando ${quantidadeLatidos} latidos...`;

    await tocarLatidos(urls);

    statusDiv.textContent = 'Pronto! Latidos tocados.';
  }

  document.getElementById('convertBtn').addEventListener('click', textoParaLatido);
});
