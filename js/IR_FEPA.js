// Função auxiliar para gerar lista de meses no formato MM/AAAA
function gerarListaMesesMMYYYY(periodoInicial, periodoFinal) {
    const parseDate = (str) => {
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
}

// Módulo FEPA com método calcular
export default {
    calcular(dados) {
        const {
            numeroProcesso,
            nomeParteAutora,
            nomeParteRe,
            periodoInicial,
            periodoFinal,
            valorBruto
        } = dados;

        // valorBruto já é um número (valorBrutoRPV)
        const valorBrutoRPV = valorBruto;
        const mesesLista = gerarListaMesesMMYYYY(periodoInicial, periodoFinal);
        const qtdMeses = mesesLista.length;
        if (qtdMeses === 0) {
            throw new Error("Período inválido.");
        }

        const valorCorrigidoPorMes = valorBrutoRPV / qtdMeses;
        let totalFEPA = 0;
        let totalValorCorrigido = 0;

        // Função que calcula o FEPA para cada mês, conforme a data
        const calcularFEPA = (mesAno, valor) => {
            const [mes, ano] = mesAno.split('/').map(Number);
            // Até fevereiro de 2020: 11%, a partir de março: 7,5%
            if (ano < 2020 || (ano === 2020 && mes <= 2)) {
                return valor * 0.11;
            } else {
                return valor * 0.075;
            }
        };

        mesesLista.forEach((mesStr) => {
            const fepa = calcularFEPA(mesStr, valorCorrigidoPorMes);
            totalFEPA += fepa;
            totalValorCorrigido += valorCorrigidoPorMes;
        });
        totalValorCorrigido = Number(totalValorCorrigido.toFixed(2));
        totalFEPA = Number(totalFEPA.toFixed(2));

        // Cálculo do IR (RRA) com base na média mensal
        const media = totalValorCorrigido / qtdMeses;
        let irMensal = 0;
        if (media <= 2259.20) {
            irMensal = 0;
        } else if (media <= 2826.65) {
            irMensal = media * 0.075 - 169.44;
        } else if (media <= 3751.05) {
            irMensal = media * 0.15 - 381.44;
        } else if (media <= 4664.68) {
            irMensal = media * 0.225 - 662.77;
        } else {
            irMensal = media * 0.275 - 896;
        }
        irMensal = Math.max(irMensal, 0);
        const irTotal = Number((irMensal * qtdMeses).toFixed(2));
        const aliquotaEfetiva = totalValorCorrigido === 0 ? 0 : Number(((irTotal / totalValorCorrigido) * 100).toFixed(2));
        const liquido = Number((valorBrutoRPV - totalFEPA - irTotal).toFixed(2));

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
            ir: irTotal,
            aliquotaEfetiva,
            liquido,
            mediaMensal: media
        };
    }
};
