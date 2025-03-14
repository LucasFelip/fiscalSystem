import IRHonorarios from './IR_Honorarios.js';
import IRFepa from './IR_FEPA.js';
import gerarPDF from './geradorPDF.js';

const calculos = {
    honorarios: IRHonorarios,
    fepa: IRFepa,
};

export function processarCalculo(event) {
    event.preventDefault();

    // Coleta dos dados do formulário (note a padronização dos ids conforme o main.html)
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
        nomeParteRe,
    };

    // Adiciona os dados específicos para cada tipo
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
    }

    try {
        if (!calculos[tipo]) {
            throw new Error("Tipo de cálculo inválido.");
        }
        // Chama o método calcular do módulo específico
        const resultado = calculos[tipo].calcular(dados);
        // Envia os dados para geração do PDF
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
