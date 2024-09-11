class RecintosZoo {
    constructor() {
        // Define os recintos disponíveis no zoológico e as especificações dos animais permitidos
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        // Define as características dos animais permitidos informados
        this.animaisPermitidos = {
            "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é válido
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        // Verifica se a quantidade é válida com um número inteiro positivo
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const infoAnimal = this.animaisPermitidos[animal];
        const recintosViaveis = [];

        // Analisa cada recinto para determinar se é adequado para o animal
        for (const recinto of this.recintos) {
            // Calcula o espaço já ocupado por animais existentes no recinto
            let espacoOcupado = recinto.animais.reduce((acc, a) => acc + a.quantidade * this.animaisPermitidos[a.especie].tamanho, 0);
            let espacoTotal = recinto.tamanhoTotal;

            // Regra 1: Verifica se o bioma do recinto é adequado para o animal
            if (!infoAnimal.biomas.includes(recinto.bioma) && recinto.bioma !== "savana e rio") {
                continue;
            }

            // Regra 2: Carnívoros devem habitar apenas com a própria espécie
            if (infoAnimal.carnivoro && recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) {
                continue;
            }

            // Regra 3: Hipopótamos toleram outras espécies apenas em recintos com "savana e rio"
            if (animal === "HIPOPOTAMO" && recinto.animais.length > 0 && recinto.bioma !== "savana e rio") {
                continue;
            }

            // Regra 4: Macacos não se sentem confortáveis sozinhos
            if (animal === "MACACO" && quantidade === 1 && recinto.animais.length === 0) {
                continue;
            }

            // Regra 5: Calcula o espaço necessário para o novo grupo de animais
            let espacoNecessario = quantidade * infoAnimal.tamanho;
            if (recinto.animais.length > 0 && (recinto.animais.length > 1 || recinto.animais.some(a => a.especie !== animal))) {
                espacoNecessario += 1; // Adiciona espaço extra se houver mais de uma espécie
            }

            // Regra 6: Verifica se há espaço suficiente no recinto
            if (espacoOcupado + espacoNecessario > espacoTotal) {
                continue;
            }

            // Regra 7: Não separar lotes de animais
            if (animal === "MACACO" && quantidade > 1 && recinto.animais.length === 0) {
                continue;
            }

            // Adiciona o recinto à lista de recintos viáveis
            const espacoLivre = espacoTotal - (espacoOcupado + espacoNecessario);
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${espacoTotal})`);
        }

        // Se não houver recintos viáveis, retorna uma mensagem de erro
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordena os recintos viáveis pelo número do recinto e retorna
        return {
            recintosViaveis: recintosViaveis.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))
        };
    }
}

export { RecintosZoo as RecintosZoo };
 
 

 
