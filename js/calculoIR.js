import calcularHonorarios from './IR_Honorarios.js';
import calcularFepa from './IR_FEPA.js';
import gerarPDF from './geradorPDF.js'

// Função para atualizar o formulário com base no tipo de IR selecionado
function atualizarFormulario(tipo) {
    const camposDinamicos = document.getElementById('camposDinamicos');
    camposDinamicos.innerHTML = ''; // Limpa os campos anteriores

    let camposHTML = '';

    switch (tipo) {
        case "honorarios":
            camposHTML = `
                <div class="row g-3">
                    <div class="col-md-12">
                    <label class="form-label">Valor Bruto (R$)</label>
                    <div class="input-group">
                      <span class="input-group-text">R$</span>
                      <input type="text" 
                             id="valorBruto" 
                             class="form-control currency-input"
                             required>
                    </div>
                  </div>
                </div>
            `;
            break;
        case "fepa":
            camposHTML = `
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label">Valor Bruto (R$)</label>
                    <div class="input-group">
                      <span class="input-group-text">R$</span>
                      <input type="text" 
                             id="valorBruto" 
                             class="form-control currency-input"
                             required>
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label">Período Inicial</label>
                        <input type="text" id="periodoInicial" class="form-control date-input" placeholder="MM/AAAA" required>
                      </div>
                      <div class="col-6">
                        <label class="form-label">Período Final</label>
                        <input type="text" id="periodoFinal" class="form-control date-input" placeholder="MM/AAAA"required>
                      </div>
                </div>
            `;
            break;
        default:
            camposHTML = `<p>Selecione um tipo válido.</p>`;
    }

    camposDinamicos.innerHTML = camposHTML;
}

function processarCalculo(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipoIR').value;
    const numeroProcesso = document.getElementById('numeroProcesso').value;
    const nomeParteAutora = document.getElementById('nomeParteAutora').value;
    const nomeParteRe = document.getElementById('nomeParteRe').value;

    // Validação básica dos campos
    if (!numeroProcesso || !nomeParteAutora || !nomeParteRe) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    // Coleta dados específicos do tipo de cálculo
    let dados = {
        numeroProcesso,
        nomeParteAutora,
        nomeParteRe
    };

    if (tipo === "fepa") {
        const valorBrutoStr = document.getElementById('valorBruto').value || '0';
        const periodoInicial = document.getElementById('periodoInicial').value;
        const periodoFinal = document.getElementById('periodoFinal').value;

        if (!periodoInicial || !periodoFinal) {
            alert("Para cálculo FEPA, informe período inicial e final!");
            return;
        }

        // Geração correta da lista de meses
        const mesesLista = gerarListaMesesMMYYYY(periodoInicial, periodoFinal);
        const qtdMeses = mesesLista.length;

        if (qtdMeses === 0) {
            alert("Período inválido! Verifique as datas.");
            return;
        }

        // Cálculo preciso do valor corrigido
        const valorBruto = parseFloat(
            valorBrutoStr.replace(/\./g, '').replace(',', '.')
        );
        const valorCorrigidoPorMes = valorBruto / qtdMeses;

        // Garante precisão decimal
        const valoresCorrigidos = Array(qtdMeses).fill()
            .map(() => Number(valorCorrigidoPorMes.toFixed(2)));

        // Ajuste residual para evitar perdas
        const residual = valorBruto - (valorCorrigidoPorMes * qtdMeses);
        if (residual !== 0) {
            valoresCorrigidos[valoresCorrigidos.length - 1] += residual;
        }

        Object.assign(dados, {
            periodoInicial,
            periodoFinal,
            valoresCorrigidos,
            valorBruto: Number(valorBruto.toFixed(2))
        });
    }

    try {
        const resultado = calcularImposto(tipo, dados);
        gerarPDF(tipo, resultado, dados);
    } catch (error) {
        console.error("Erro:", error);
        alert(error.message);
    }
}

// Inicializa o comportamento da página
document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o formulário ao trocar a seleção
    document.getElementById('tipoIR').addEventListener('change', (event) => {
        atualizarFormulario(event.target.value);
    });

    // Captura o evento de submit
    document.getElementById('formIR').addEventListener('submit', processarCalculo);

    // Define o formulário inicial
    atualizarFormulario(document.getElementById('tipoIR').value);
});

// Função para chamar os cálculos corretos
function calcularImposto(tipo, dados) {
    switch (tipo) {
        case "honorarios":
            return calcularHonorarios(dados);
        case "fepa":
            return calcularFepa(dados);
        default:
            throw new Error("Tipo de cálculo inválido. Selecione 'honorarios' ou 'fepa'.");
    }
}
