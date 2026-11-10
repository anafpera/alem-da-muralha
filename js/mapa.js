
/* =====================================
   MAPA INTERATIVO - ALEM DA MURALHA
===================================== */

// Verifica se a biblioteca Leaflet foi carregada
const elementoMapa = document.getElementById("mapa-china");

if (typeof L === "undefined") {

    elementoMapa.innerHTML = `
        <p style="padding: 25px; color: #8f2028;">
            Não foi possível carregar o mapa.
            Verifique sua conexão com a internet e atualize a página.
        </p>
    `;

} else {

    // 1. CADASTRO DOS DESTINOS

    const destinos = [

        {
            id: "pequim",
            nome: "Pequim",
            regiao: "NORTE DA CHINA",
            coordenadas: [39.9042, 116.4074],
            descricao:
                "Capital da China e um dos destinos históricos mais importantes do país. Pequim reúne palácios imperiais, templos, arquitetura tradicional e acesso a diferentes trechos da Grande Muralha.",
            atracoes: [
                "Cidade Proibida",
                "Grande Muralha da China",
                "Templo do Céu"
            ],
            resumo: "História imperial e cultura chinesa."
        },

        {
            id: "xangai",
            nome: "Xangai",
            regiao: "LESTE DA CHINA",
            coordenadas: [31.2304, 121.4737],
            descricao:
                "Uma metrópole que combina arranha-céus, bairros históricos, gastronomia e uma intensa vida urbana. Xangai é um dos grandes símbolos da China contemporânea.",
            atracoes: [
                "The Bund",
                "Jardim Yuyuan",
                "Torre de Xangai"
            ],
            resumo: "Modernidade, arquitetura e experiências urbanas."
        },

        {
            id: "zhangjiajie",
            nome: "Zhangjiajie",
            regiao: "PROVÍNCIA DE HUNAN",
            coordenadas: [29.1170, 110.4792],
            descricao:
                "Destino conhecido por suas impressionantes formações rochosas, montanhas cobertas de vegetação e paisagens naturais. Uma região especialmente interessante para quem ama natureza.",
            atracoes: [
                "Parque Nacional de Zhangjiajie",
                "Montanha Tianmen",
                "Área cênica de Wulingyuan"
            ],
            resumo: "Montanhas, natureza e paisagens extraordinárias."
        },

        {
            id: "xian",
            nome: "Xi'an",
            regiao: "NOROESTE DA CHINA",
            coordenadas: [34.3416, 108.9398],
            descricao:
                "Uma cidade fundamental para compreender a história chinesa. Xi'an foi capital de diferentes dinastias e é conhecida por seu patrimônio arqueológico.",
            atracoes: [
                "Exército de Terracota",
                "Muralha de Xi'an",
                "Bairro Muçulmano"
            ],
            resumo: "Arqueologia, história e antigas dinastias."
        },

        {
            id: "chengdu",
            nome: "Chengdu",
            regiao: "PROVÍNCIA DE SICHUAN",
            coordenadas: [30.5728, 104.0668],
            descricao:
                "Conhecida pela cultura gastronômica de Sichuan e por seus centros de conservação de pandas-gigantes, Chengdu oferece uma experiência urbana com forte identidade regional.",
            atracoes: [
                "Base de Pesquisa de Pandas de Chengdu",
                "Rua histórica Jinli",
                "Gastronomia de Sichuan"
            ],
            resumo: "Pandas, gastronomia e cultura regional."
        },

        {
            id: "guilin",
            nome: "Guilin",
            regiao: "REGIÃO AUTÔNOMA DE GUANGXI",
            coordenadas: [25.2736, 110.2900],
            descricao:
                "Guilin é conhecida por suas paisagens de montanhas cársticas, rios e vegetação. É um destino muito procurado por quem deseja explorar o lado natural da China.",
            atracoes: [
                "Rio Li",
                "Colina da Tromba do Elefante",
                "Paisagens de Yangshuo"
            ],
            resumo: "Natureza, rios e paisagens inesquecíveis."
        }

    ];

    // 2. CRIAÇÃO DO MAPA

    const mapa = L.map("mapa-china", {
        scrollWheelZoom: true,
        minZoom: 3
    });

    // Camada de mapa do OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    // 3. CRIAÇÃO DOS MARCADORES

    const marcadores = {};

    destinos.forEach((destino) => {

        const marcador = L.marker(destino.coordenadas).addTo(mapa);

        marcador.bindPopup(`
            <strong>${destino.nome}</strong><br>
            ${destino.resumo}
        `);

        // Ao clicar no marcador, atualiza os detalhes
        marcador.on("click", () => {
            mostrarDestino(destino, false);
        });

        marcadores[destino.id] = marcador;

    });

    // 4. AJUSTAR O MAPA PARA MOSTRAR TODOS OS DESTINOS

    const limites = L.latLngBounds(
        destinos.map((destino) => destino.coordenadas)
    );

    mapa.fitBounds(limites, {
        padding: [35, 35]
    });

    // 5. ELEMENTOS DO PAINEL DE DETALHES

    const detalheRegiao = document.getElementById("detalhe-regiao");
    const detalheNome = document.getElementById("detalhe-nome");
    const detalheDescricao = document.getElementById("detalhe-descricao");
    const listaAtracoes = document.getElementById("lista-atracoes");

    const botoesCidades = document.querySelectorAll(".cidade-opcao");

    // 6. ATUALIZAR O PAINEL QUANDO UMA CIDADE É SELECIONADA

    function mostrarDestino(destino, centralizarMapa) {

        detalheRegiao.textContent = destino.regiao;
        detalheNome.textContent = destino.nome;
        detalheDescricao.textContent = destino.descricao;

        // Limpa as atrações anteriores
        listaAtracoes.replaceChildren();

        // Adiciona as atrações da cidade selecionada
        destino.atracoes.forEach((atracao) => {

            const item = document.createElement("li");

            item.textContent = atracao;

            listaAtracoes.appendChild(item);

        });

        // Atualiza o botão ativo
        botoesCidades.forEach((botao) => {

            botao.classList.toggle(
                "ativa",
                botao.dataset.cidade === destino.id
            );

        });

        // Centraliza o mapa na cidade escolhida
        if (centralizarMapa) {

            mapa.flyTo(destino.coordenadas, 7, {
                duration: 1.2
            });

            marcadores[destino.id].openPopup();

        }

    }

    // 7. CLIQUES NA LISTA DE CIDADES

    botoesCidades.forEach((botao) => {

        botao.addEventListener("click", () => {

            const destinoSelecionado = destinos.find(
                (destino) => destino.id === botao.dataset.cidade
            );

            if (destinoSelecionado) {
                mostrarDestino(destinoSelecionado, true);
            }

        });

    });

    // 8. DESTINO INICIAL

    mostrarDestino(destinos[0], false);

}
