import { formatarCRC } from './formatFields.js';

function getSignatureInfo() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        return { nome: "N/A", crc: "N/A", dataHora: "N/A", hash: "N/A" };
    }
    const nome = usuarioLogado.nomeCompleto;
    const crc = formatarCRC(usuarioLogado.crc);
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dataHora = now.toLocaleString('pt-BR', options);

    // Geração simples de hash (algoritmo djb2)
    let hash = 5381;
    const str = nome + crc + dataHora;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    hash = hash >>> 0;
    const hashHex = hash.toString(16).toUpperCase();
    return { nome, crc, dataHora, hash: hashHex };
}

function formatarNumeroBR(valor, isPercent = false) {
    if (typeof valor !== "number") return valor;
    const formatted = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return isPercent ? `${formatted}%` : `R$ ${formatted}`;
}

export default function gerarPDF(tipoIR, resultado, dados) {
    if (!window.jspdf) {
        console.error("Biblioteca jsPDF não carregada!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Título do Relatório
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RELATÓRIO OFICIAL", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const titulo = `Cálculo de ${tipoIR === "honorarios" ? "Imposto de Renda" : "RRA + FEPA"} - Lei 14.848/2024`;
    doc.text(titulo, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Dados do Processo
    doc.setFont("helvetica", "bold");
    doc.text("Dados do Processo", margin, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Número do Processo: ${dados.numeroProcesso}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Nome da parte autora: ${dados.nomeParteAutora}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Nome da parte ré: ${dados.nomeParteRe}`, margin, yPosition);
    yPosition += 10;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Seção de Cálculo
    doc.setFont("helvetica", "bold");
    doc.text("Cálculo", margin, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");

    if (tipoIR === "honorarios") {
        doc.text(`Valor Bruto do Pagamento: ${formatarNumeroBR(dados.valorBruto)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Imposto de Renda Calculado: ${formatarNumeroBR(resultado.imposto)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Alíquota Efetiva: ${formatarNumeroBR(resultado.aliquotaEfetiva, true)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Líquido: ${formatarNumeroBR(resultado.liquido)}`, margin, yPosition);
        yPosition += 10;
    } else if (tipoIR === "fepa") {
        doc.text(`Período Inicial: ${dados.periodoInicial}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Período Final: ${dados.periodoFinal}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Quantidade de meses (RRA): ${resultado.meses}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Bruto do RPV: ${formatarNumeroBR(dados.valorBruto)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Bruto Corrigido: ${formatarNumeroBR(resultado.totalValorCorrigido)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Média Mensal: ${formatarNumeroBR(resultado.mediaMensal)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Total FEPA: ${formatarNumeroBR(resultado.totalFEPA)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`IR (RRA): ${formatarNumeroBR(resultado.ir)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Alíquota Efetiva: ${formatarNumeroBR(resultado.aliquotaEfetiva, true)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Líquido: ${formatarNumeroBR(resultado.liquido)}`, margin, yPosition);
        yPosition += 10;
    } else if (tipoIR === "rra") {
        doc.text(`Quantidade de meses (RRA): ${resultado.quantidadeMeses}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Bruto do RPV: ${formatarNumeroBR(resultado.valorBrutoRPV)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Base de Cálculo do IR: ${formatarNumeroBR(resultado.baseCalculo)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Média Mensal: ${formatarNumeroBR(resultado.mediaMensal)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Imposto Mensal: ${formatarNumeroBR(resultado.impostoMensal)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Imposto Total: ${formatarNumeroBR(resultado.impostoTotal)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Alíquota Efetiva: ${formatarNumeroBR(resultado.aliquotaEfetiva, true)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Líquido: ${formatarNumeroBR(resultado.valorLiquido)}`, margin, yPosition);
        yPosition += 10;
    } else if (tipoIR === "pj") {
        doc.text(`Valor Bruto do RPV: ${formatarNumeroBR(resultado.valorBrutoRPV)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Corrigido do RPV: ${formatarNumeroBR(resultado.valorCorrigidoRPV)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Optante pelo Simples Nacional: ${resultado.optanteSimples === "sim" ? "Sim" : "Não"}`, margin, yPosition);
        yPosition += 7;
        if (resultado.optanteSimples === "nao") {
            doc.text(`Ramo de Atividade: ${resultado.ramoAtividade}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Alíquota do IRPJ: ${formatarNumeroBR(resultado.aliquotaIR, true)}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Imposto de Renda Pessoa Jurídica (IRPJ): ${formatarNumeroBR(resultado.impostoIR)}`, margin, yPosition);
            yPosition += 7;
        }
        doc.text(`Valor Líquido após IRPJ: ${formatarNumeroBR(resultado.valorLiquido)}`, margin, yPosition);
        yPosition += 10;
    }

    // Nota Explicativa
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    let notaExplicativa = "";
    switch (tipoIR) {
        case "honorarios":
            notaExplicativa = "Nota Explicativa: Dedução do IRRF, conforme a tabela progressiva contida na Lei nº 14.848/2024.";
            break;
        case "fepa":
            notaExplicativa = "Nota Explicativa: Base de Cálculo: Valor Bruto Corrigido (não incidindo juros); FEPA: 11% até 02/2020 e 7,5% a partir de 03/2020; IR (RRA): conforme Tabela Progressiva da Lei nº 14.848/2024.";
            break;
        case "rra":
            notaExplicativa = "Nota Explicativa: O cálculo do IR sobre RRA segue a tabela progressiva de tributação, levando em conta a média mensal dos valores acumulados e aplicando a dedução conforme legislação vigente (Lei nº 14.848/2024).";
            break;
        case "pj":
            notaExplicativa = "Nota Explicativa: O cálculo do IRPJ é baseado no regime de tributação da empresa. Empresas optantes pelo Simples Nacional estão isentas. Para demais empresas, aplicam-se as alíquotas conforme a atividade desempenhada.";
            break;
    }

    const notaLines = doc.splitTextToSize(notaExplicativa, pageWidth - margin * 2);
    doc.text(notaLines, margin, yPosition);

    const footerStartY = pageHeight - 40;
    const assinatura = getSignatureInfo();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Assinado digitalmente por ${assinatura.nome}`, margin, footerStartY + 25);
    doc.text(`CRC-MA: ${assinatura.crc}`, margin, footerStartY + 30);
    doc.text(`Data e Hora: ${assinatura.dataHora}`, margin, footerStartY + 35);

    doc.save(`relatorio_${tipoIR}_${dados.numeroProcesso}.pdf`);
    return doc;
}
