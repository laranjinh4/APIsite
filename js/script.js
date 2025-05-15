
    async function buscarClima() {
      const input = document.getElementById("cidade");
      const cidade = input.value.trim();
      const carregando = document.getElementById("carregando");
      const resultadosDiv = document.getElementById("resultados");

      if (!cidade) {
        alert("Por favor, digite o nome de uma cidade.");
        return;
      }

      carregando.style.display = "block";

      try {
        // Passo 1: Obter coordenadas com OpenCage Geocoder
        const apiKeyGeocoder = '48b9f91a73c8436390a9816d09d9dcf8'; // Substitua aqui
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cidade)}&key=${apiKeyGeocoder}`;

        const geoResposta = await fetch(geocodeUrl);
        const geoDados = await geoResposta.json();

        if (!geoDados.results || geoDados.results.length === 0) {
          throw new Error("Cidade não encontrada.");
        }

        const lat = geoDados.results[0].geometry.lat;
        const lon = geoDados.results[0].geometry.lng;

        // Passo 2: Buscar clima com Open-Meteo
        const climaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        const climaResposta = await fetch(climaUrl);
        const climaDados = await climaResposta.json();

        const temperatura = climaDados.current_weather.temperature;

        // Exibir resultado como card
        const novoCard = document.createElement("div");
        novoCard.className = "result-card";
        novoCard.innerHTML = `<strong>${cidade}:</strong> ${temperatura}°C`;

        resultadosDiv.appendChild(novoCard);

        // Limpar campo de entrada
        input.value = "";
      } catch (error) {
        console.error(error);
        resultadosDiv.innerHTML += `<div class="error">Erro ao buscar clima para "${cidade}": ${error.message}</div>`;
      } finally {
        carregando.style.display = "none";
      }
    }
  