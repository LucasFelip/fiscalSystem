/**
 * Gera uma lista de meses no formato MM/AAAA entre os períodos informados.
 * @param {string} periodoInicial
 * @param {string} periodoFinal
 * @returns {string[]} Array de meses
 */
const gerarListaMesesMMYYYY = (periodoInicial, periodoFinal) => {
    const parseDate = str => {
        const [mes, ano] = str.split('/').map(Number);
        return new Date(ano, mes - 1, 1);
    };

    let startDate = parseDate(periodoInicial);
    let endDate = parseDate(periodoFinal);
    if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

    const meses = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        meses.push(`${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return meses;
};

/**
 * Calcula o FEPA para o mês/ano e o valor corrigido informado.
 * @param {string} mesAno
 * @param {number} valorCorrigido
 * @returns {number}
 */
const calcularFEPA = (mesAno, valorCorrigido) => {
    const [mes, ano] = mesAno.split('/').map(Number);
    return (ano < 2020 || (ano === 2020 && mes <= 2))
        ? valorCorrigido * 0.11
        : valorCorrigido * 0.075;
};

/**
 * Calcula o IR (RRA) com base no total corrigido e número de meses.
 * @param {number} totalValorCorrigido
 * @param {number} meses
 * @returns {object}
 */
const calcularIRRRA = (totalValorCorrigido, meses) => {
    const adjustedMeses = meses < 1 ? 1 : meses;
    const media = totalValorCorrigido / adjustedMeses;
    let impostoMensal = 0;

    if (media > 2259.20) {
        if (media <= 2826.65) {
            impostoMensal = media * 0.075 - 169.44;
        } else if (media <= 3751.05) {
            impostoMensal = media * 0.15 - 381.44;
        } else if (media <= 4664.68) {
            impostoMensal = media * 0.225 - 662.77;
        } else {
            impostoMensal = media * 0.275 - 896;
        }
    }
    impostoMensal = Math.max(impostoMensal, 0);
    const impostoTotal = Number((impostoMensal * adjustedMeses).toFixed(2));
    const aliquotaEfetiva = totalValorCorrigido > 0
        ? Number(((impostoTotal / totalValorCorrigido) * 100).toFixed(2))
        : 0;

    return { impostoTotal, aliquotaEfetiva };
};

export default {
    calcular(dados) {
        const { numeroProcesso, nomeParteAutora, nomeParteRe, periodoInicial, periodoFinal, valorBruto } = dados;
        const valorBrutoRPV = Number(valorBruto);
        const mesesLista = gerarListaMesesMMYYYY(periodoInicial, periodoFinal);
        const qtdMeses = mesesLista.length;

        if (qtdMeses === 0) throw new Error("Período inválido.");

        let totalFEPA = 0, totalValorCorrigido = 0;
        const fatorCorrecao = 0.85;

        mesesLista.forEach(mesStr => {
            const valorCorrigidoPorMes = Number(((valorBrutoRPV / qtdMeses) * fatorCorrecao).toFixed(2));
            totalValorCorrigido += valorCorrigidoPorMes;
            totalFEPA += calcularFEPA(mesStr, valorCorrigidoPorMes);
        });

        totalValorCorrigido = Number(totalValorCorrigido.toFixed(2));
        totalFEPA = Number(totalFEPA.toFixed(2));

        const { impostoTotal: ir, aliquotaEfetiva } = calcularIRRRA(totalValorCorrigido, qtdMeses);
        const liquido = Number((valorBrutoRPV - totalFEPA - ir).toFixed(2));

        return {
            numeroProcesso,
            nomeParteAutora,
            nomeParteRe,
            periodoInicial,
            periodoFinal,
            meses: qtdMeses,
            valorBrutoRPV,
            totalValorCorrigido,
            totalFEPA,
            ir,
            aliquotaEfetiva,
            liquido,
            mediaMensal: Number((totalValorCorrigido / qtdMeses).toFixed(2))
        };
    }
};
