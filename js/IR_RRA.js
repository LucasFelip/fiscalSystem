export default {
    /**
     * Calcula o imposto para RRA com base nos dados informados.
     * @param {object} dados
     * @returns {object}
     */
    calcular(dados) {
        const {
            numeroProcesso,
            nomeParteAutora,
            nomeParteRe,
            quantidadeMeses,
            valorBruto,
            baseCalculoIR
        } = dados;

        if (quantidadeMeses < 1) {
            throw new Error("A quantidade de meses deve ser pelo menos 1.");
        }

        const valorBrutoRPV = Number(valorBruto);
        const baseCalculo = Number(baseCalculoIR);

        if (isNaN(valorBrutoRPV) || isNaN(baseCalculo) || baseCalculo <= 0) {
            throw new Error("Os valores inseridos são inválidos.");
        }

        const mediaMensal = baseCalculo / quantidadeMeses;
        let impostoMensal = 0;

        if (mediaMensal > 2259.20) {
            if (mediaMensal <= 2826.65) {
                impostoMensal = mediaMensal * 0.075 - 169.44;
            } else if (mediaMensal <= 3751.05) {
                impostoMensal = mediaMensal * 0.15 - 381.44;
            } else if (mediaMensal <= 4664.68) {
                impostoMensal = mediaMensal * 0.225 - 662.77;
            } else {
                impostoMensal = mediaMensal * 0.275 - 896;
            }
        }

        impostoMensal = Math.max(impostoMensal, 0);
        const impostoTotal = Number((impostoMensal * quantidadeMeses).toFixed(2));
        const aliquotaEfetiva = baseCalculo > 0 ? Number(((impostoTotal / baseCalculo) * 100).toFixed(2)) : 0;
        const valorLiquido = Number((valorBrutoRPV - impostoTotal).toFixed(2));

        return {
            numeroProcesso,
            nomeParteAutora,
            nomeParteRe,
            quantidadeMeses,
            valorBrutoRPV,
            baseCalculo,
            impostoTotal,
            impostoMensal,
            aliquotaEfetiva,
            valorLiquido,
            mediaMensal
        };
    }
};
