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

/**
 * Converte uma string no formato de moeda brasileira para número.
 * @param {string} value Valor no formato "1.234,56"
 * @returns {number}
 */
const parseCurrency = (value) =>
    Number(parseFloat(value.replace(/\./g, '').replace(',', '.')).toFixed(2));

export function processarCalculo(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipoIR')?.value;
    const numeroProcesso = document.getElementById('numProcess')?.value;
    const nomeParteAutora = document.getElementById('parteAtiva')?.value;
    const nomeParteRe = document.getElementById('partePassiva')?.value;

    if (!numeroProcesso || !nomeParteAutora || !nomeParteRe) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const dados = { numeroProcesso, nomeParteAutora, nomeParteRe };

    try {
        if (tipo === "honorarios") {
            const valorBrutoStr = document.getElementById('valorBruto')?.value || '0';
            dados.valorBruto = parseCurrency(valorBrutoStr);
        } else if (tipo === "fepa") {
            const valorBrutoStr = document.getElementById('valorBruto')?.value || '0';
            const periodoInicial = document.getElementById('periodoInicial')?.value;
            const periodoFinal = document.getElementById('periodoFinal')?.value;

            if (!periodoInicial || !periodoFinal) {
                alert("Para cálculo FEPA, informe período inicial e final!");
                return;
            }
            dados.valorBruto = parseCurrency(valorBrutoStr);
            dados.periodoInicial = periodoInicial;
            dados.periodoFinal = periodoFinal;
        } else if (tipo === "rra") {
            const quantidadeMeses = parseInt(document.getElementById('quantidadeMeses')?.value || '0', 10);
            const valorBrutoStr = document.getElementById('valorBruto')?.value || '0';
            const baseCalculoIRStr = document.getElementById('baseCalculoIR')?.value || '0';

            if (quantidadeMeses < 1) {
                alert("Informe um número válido de meses.");
                return;
            }
            dados.quantidadeMeses = quantidadeMeses;
            dados.valorBruto = parseCurrency(valorBrutoStr);
            dados.baseCalculoIR = parseCurrency(baseCalculoIRStr);
        } else if (tipo === "pj") {
            const valorBrutoStr = document.getElementById('valorBruto')?.value || '0';
            const valorCorrigidoStr = document.getElementById('valorCorrigido')?.value || '0';
            const optanteSimples = document.getElementById('optanteSimples')?.value;
            const ramoAtividade = document.getElementById('ramoAtividade')?.value || "0";

            dados.valorBruto = parseCurrency(valorBrutoStr);
            dados.valorCorrigido = parseCurrency(valorCorrigidoStr);
            dados.optanteSimples = optanteSimples;
            dados.ramoAtividade = ramoAtividade;
        }

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
    form?.addEventListener('submit', processarCalculo);
});
