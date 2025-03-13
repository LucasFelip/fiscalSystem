function gerarListaMesesMMYYYY(periodoInicial, periodoFinal) {
    const parseDate = (str) => {
        const [mes, ano] = str.split('/').map(Number);
        return new Date(ano, mes - 1, 1);
    };

    let startDate = parseDate(periodoInicial);
    let endDate = parseDate(periodoFinal);

    // Inverte datas se necessário
    if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

    const meses = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        meses.push(
            `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`
        );
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return meses;
}

function calcularFEPA(dados) {
    const [mesStr, anoStr] = dataStr.split('/');
    const mes = parseInt(mesStr);
    const ano = parseInt(anoStr);

    if (ano < 2020 || (ano === 2020 && mes <= 2)) {
        return valorCorrigido * 0.11;
    } else {
        return valorCorrigido * 0.075;
    }
}

function calcularIRRRA(totalValorCorrigido, meses) {
    if (meses < 1) meses = 1;
    const media = totalValorCorrigido / meses;

    let impostoMensal = 0;
    if (media <= 2259.20) {
        impostoMensal = 0;
    } else if (media <= 2826.65) {
        impostoMensal = media * 0.075 - 169.44;
    } else if (media <= 3751.05) {
        impostoMensal = media * 0.15 - 381.44;
    } else if (media <= 4664.68) {
        impostoMensal = media * 0.225 - 662.77;
    } else {
        impostoMensal = media * 0.275 - 896;
    }

    impostoMensal = Math.max(impostoMensal, 0);
    const impostoTotal = impostoMensal * meses;
    const aliqEfetiva = totalValorCorrigido === 0 ? 0 : (impostoTotal / totalValorCorrigido) * 100;

    return {
        impostoTotal: Number(impostoTotal.toFixed(2)),
        aliqEfetiva: Number(aliqEfetiva.toFixed(2)),
    };
}

function calcularRRAFEPA(
    numeroProcesso,
    nomeParteAutora,
    nomeParteRe,
    periodoInicial,
    periodoFinal,
    valorBrutoRPV
) {
    // Converter valorBrutoRPV para número (ex: '10.000,00' → 10000.00)
    const valorBrutoRPVNumerico = parseFloat(
        valorBrutoRPV.replace(/\./g, '').replace(',', '.')
    );

    const mesesLista = gerarListaMesesMMYYYY(periodoInicial, periodoFinal);
    const qtdMeses = mesesLista.length;

    if (qtdMeses === 0) {
        throw new Error('Período inicial/final inválido.');
    }

    const valorCorrigidoPorMes = valorBrutoRPVNumerico / qtdMeses;
    let totalFEPA = 0;
    let totalValorCorrigido = 0;

    mesesLista.forEach((mesStr) => {
        const fepa = calcularFEPA(mesStr, valorCorrigidoPorMes);
        totalFEPA += fepa;
        totalValorCorrigido += valorCorrigidoPorMes;
    });

    totalValorCorrigido = Number(totalValorCorrigido.toFixed(2));
    totalFEPA = Number(totalFEPA.toFixed(2));

    const { impostoTotal: irTotal, aliqEfetiva: aliqIR } = calcularIRRRA(totalValorCorrigido, qtdMeses);
    const valorLiquido = Math.max(valorBrutoRPVNumerico - totalFEPA - irTotal, 0);

    return {
        numeroProcesso,
        nomeParteAutora,
        nomeParteRe,
        periodoInicial,
        periodoFinal,
        qtdMeses,
        valorBrutoRPV: valorBrutoRPVNumerico,
        totalValorCorrigido,
        totalFEPA,
        irTotal,
        aliqIR,
        valorLiquido: Number(valorLiquido.toFixed(2)),
    };
}

// Exemplo de uso:
const resultado = calcularRRAFEPA(
    '12345',
    'João Silva',
    'Empresa XYZ',
    '01/2019',
    '06/2020',
    '4.037,68'
);

console.log(resultado);