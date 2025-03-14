import { aplicarFormatacao } from './formatFields.js';
aplicarFormatacao();


export function atualizarFormulario(tipo) {
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
                        <input type="text" id="periodoFinal" class="form-control date-input" placeholder="MM/AAAA" required>
                    </div>
                </div>
            `;
            break;
        default:
            camposHTML = `<p>Selecione um tipo válido.</p>`;
    }

    camposDinamicos.innerHTML = camposHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const tipoIR = document.getElementById('tipoIR');
    if (tipoIR) {
        // Atualiza o formulário com o valor inicial e adiciona listener para mudanças
        atualizarFormulario(tipoIR.value);
        tipoIR.addEventListener('change', (event) => {
            atualizarFormulario(event.target.value);
        });
    }
});
