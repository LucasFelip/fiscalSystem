export default {
    /**
     * Calcula o imposto para pessoa jurídica (PJ) com base nos dados informados.
     * @param {object} dados
     * @returns {object}
     */
    calcular(dados) {
        const {
            numeroProcesso,
            nomeParteAutora,
            nomeParteRe,
            valorBruto,
            valorCorrigido,
            optanteSimples,
            ramoAtividade
        } = dados;

        const valorBrutoRPV = Number(valorBruto);
        const valorCorrigidoRPV = Number(valorCorrigido);

        if (isNaN(valorBrutoRPV) || isNaN(valorCorrigidoRPV) || valorCorrigidoRPV <= 0) {
            throw new Error("Os valores inseridos são inválidos.");
        }

        let aliquotaIR = 0;
        let descricaoRamo = "Optante Simples (Sem IR)";
        let impostoIR = 0;

        if (optanteSimples === "nao") {
            switch (ramoAtividade) {
                case "1":
                    aliquotaIR = 0.048;
                    descricaoRamo = "Modalidade Geral (4.8%)";
                    break;
                case "2":
                    aliquotaIR = 0.015;
                    descricaoRamo = "Profissional Liberal (1.5%)";
                    break;
                case "3":
                    aliquotaIR = 0.01;
                    descricaoRamo = "Cessão de Mão de Obra (1.0%)";
                    break;
                default:
                    throw new Error("Ramo de atividade inválido.");
            }
            impostoIR = Number((valorCorrigidoRPV * aliquotaIR).toFixed(2));
        }

        const valorLiquido = Number((valorBrutoRPV - impostoIR).toFixed(2));

        return {
            numeroProcesso,
            nomeParteAutora,
            nomeParteRe,
            valorBrutoRPV,
            valorCorrigidoRPV,
            optanteSimples,
            ramoAtividade: descricaoRamo,
            aliquotaIR: aliquotaIR * 100,
            impostoIR,
            valorLiquido
        };
    }
};
