import IRHonorarios from './IR_Honorarios.js';
import IRFepa from './IR_FEPA.js';
import IRRRA from './IR_RRA.js';
import IRPJ from "./IR_PJ.js";
import gerarPDF from './geradorPDF.js';

const calculos = {
    honorarios: IRHonorarios,
    fepa: IRFepa,
    rra: IRRRA,
    pj: IRPJ
};

export function processarCalculo(event) {
    event.preventDefault();

    // Coleta dos dados do formulário
    const tipo = document.getElementById('tipoIR').value;
    const numeroProcesso = document.getElementById('numProcess').value;
    const nomeParteAutora = document.getElementById('parteAtiva').value;
    const nomeParteRe = document.getElementById('partePassiva').value;

    if (!numeroProcesso || !nomeParteAutora || !nomeParteRe) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    // Cria o objeto dados com os campos comuns
    let dados = {
        numeroProcesso,
        nomeParteAutora,
        nomeParteRe
    };

    if (tipo === "honorarios") {
        const valorBrutoStr = document.getElementById('valorBruto').value || '0';
        const valorBruto = parseFloat(valorBrutoStr.replace(/\./g, '').replace(',', '.'));
        dados.valorBruto = Number(valorBruto.toFixed(2));
    } else if (tipo === "fepa") {
        const valorBrutoStr = document.getElementById('valorBruto').value || '0';
        const periodoInicial = document.getElementById('periodoInicial').value;
        const periodoFinal = document.getElementById('periodoFinal').value;

        if (!periodoInicial || !periodoFinal) {
            alert("Para cálculo FEPA, informe período inicial e final!");
            return;
        }

        const valorBruto = parseFloat(valorBrutoStr.replace(/\./g, '').replace(',', '.'));
        dados.valorBruto = Number(valorBruto.toFixed(2));
        dados.periodoInicial = periodoInicial;
        dados.periodoFinal = periodoFinal;

    } else if (tipo === "rra") {
        const quantidadeMeses = parseInt(document.getElementById('quantidadeMeses').value || '0', 10);
        const valorBrutoStr = document.getElementById('valorBruto').value || '0';
        const baseCalculoIRStr = document.getElementById('baseCalculoIR').value || '0';

        if (quantidadeMeses < 1) {
            alert("Informe um número válido de meses.");
            return;
        }

        const valorBruto = parseFloat(valorBrutoStr.replace(/\./g, '').replace(',', '.'));
        const baseCalculoIR = parseFloat(baseCalculoIRStr.replace(/\./g, '').replace(',', '.'));

        dados.quantidadeMeses = quantidadeMeses;
        dados.valorBruto = Number(valorBruto.toFixed(2));
        dados.baseCalculoIR = Number(baseCalculoIR.toFixed(2));
    } else if (tipo === "pj") {
        const valorBrutoStr = document.getElementById('valorBruto').value || '0';
        const valorCorrigidoStr = document.getElementById('valorCorrigido').value || '0';
        const optanteSimples = document.getElementById('optanteSimples').value;
        const ramoAtividade = document.getElementById('ramoAtividade')?.value || "0";

        const valorBruto = parseFloat(valorBrutoStr.replace(/\./g, '').replace(',', '.'));
        const valorCorrigido = parseFloat(valorCorrigidoStr.replace(/\./g, '').replace(',', '.'));

        dados.valorBruto = Number(valorBruto.toFixed(2));
        dados.valorCorrigido = Number(valorCorrigido.toFixed(2));
        dados.optanteSimples = optanteSimples;
        dados.ramoAtividade = ramoAtividade;
    }

    try {
        if (!calculos[tipo]) {
            throw new Error("Tipo de cálculo inválido.");
        }
        const resultado = calculos[tipo].calcular(dados);
        gerarPDF(tipo, resultado, dados);
    } catch (error) {
        console.error("Erro:", error);
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formIR');
    if (form) {
        form.addEventListener('submit', processarCalculo);
    }
});
