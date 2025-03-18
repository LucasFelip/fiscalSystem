import { aplicarFormatacao } from './formatFields.js';
aplicarFormatacao();

export function atualizarFormulario(tipo) {
    const camposDinamicos = document.getElementById('camposDinamicos');
    if (!camposDinamicos) return;
    camposDinamicos.innerHTML = '';

    let camposHTML = '';

    switch (tipo) {
        case "honorarios":
            camposHTML = `
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label">Valor Bruto do Pagamento (R$)</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input type="text" id="valorBruto" class="form-control currency-input" required>
            </div>
          </div>
        </div>
      `;
            break;
        case "fepa":
            camposHTML = `
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label">Valor Bruto do RPV (R$)</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input type="text" id="valorBruto" class="form-control currency-input" required>
            </div>
          </div>
          <div class="col-6">
            <label class="form-label">Período Inicial</label>
            <input type="text" id="periodoInicial" class="form-control date-input" placeholder="MM/AAAA" required>
          </div>
          <div class="col-6">
            <label class="form-label">Período Final</label>
            <input type="text" id="periodoFinal" class="form-control date-input" placeholder="MM/AAAA" required>
          </div>
        </div>
      `;
            break;
        case "rra":
            camposHTML = `
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Quantidade de Meses (RRA)</label>
            <input type="number" id="quantidadeMeses" class="form-control" min="1" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Valor Bruto do RPV (R$)</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input type="text" id="valorBruto" class="form-control currency-input" required>
            </div>
          </div>
          <div class="col-md-12">
            <label class="form-label">Base de Cálculo do IR (R$)</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input type="text" id="baseCalculoIR" class="form-control currency-input" required>
            </div>
          </div>
        </div>
      `;
            break;
        case "pj":
            camposHTML = `
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Valor Bruto do RPV (R$)</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input type="text" id="valorBruto" class="form-control currency-input" required>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Valor Corrigido do RPV (R$)</label>
            <div class="input-group">
              <span class="input-group-text">R$</span>
              <input type="text" id="valorCorrigido" class="form-control currency-input" required>
            </div>
          </div>
          <div class="col-md-12">
            <label class="form-label">Optante pelo Simples Nacional?</label>
            <select id="optanteSimples" class="form-select">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div class="col-md-12" id="ramoAtividadeContainer" style="display: none;">
            <label class="form-label">Ramo de Atividade</label>
            <select id="ramoAtividade" class="form-select">
              <option value="1">Modalidade Geral (4.8%)</option>
              <option value="2">Profissional Liberal (1.5%)</option>
              <option value="3">Cessão de Mão de Obra (1.0%)</option>
            </select>
          </div>
        </div>
      `;
            break;
        default:
            camposHTML = `<p>Selecione um tipo válido.</p>`;
    }

    camposDinamicos.innerHTML = camposHTML;

    // Controla a exibição do campo "Ramo de Atividade"
    const optanteSimples = document.getElementById('optanteSimples');
    const ramoAtividadeContainer = document.getElementById('ramoAtividadeContainer');
    if (optanteSimples && ramoAtividadeContainer) {
        optanteSimples.addEventListener('change', () => {
            ramoAtividadeContainer.style.display = optanteSimples.value === "nao" ? "block" : "none";
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tipoIR = document.getElementById('tipoIR');
    if (tipoIR) {
        atualizarFormulario(tipoIR.value);
        tipoIR.addEventListener('change', (event) => {
            atualizarFormulario(event.target.value);
        });
    }
});
