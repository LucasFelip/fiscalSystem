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

    // Função para formatar o número do processo judicial brasileiro
    function formatProcessNumber(num) {
        // Remove caracteres não numéricos
        const digits = num.replace(/\D/g, '');
        if (digits.length !== 20) return num;
        return `${digits.substr(0,7)}-${digits.substr(7,2)}.${digits.substr(9,4)}.${digits.substr(13,1)}.${digits.substr(14,2)}.${digits.substr(16,4)}`;
    }

    // Função para adicionar uma linha com espaçamento
    const addLine = (label, value, ln = 1) => {
        const text = `${label}: ${value}`;
        doc.text(margin, yPosition, text);
        yPosition += 7 * ln;
    };

    // Cabeçalho do documento (seção oficial)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RELATÓRIO OFICIAL", margin, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const titulo = `Cálculo de ${tipoIR === "honorarios" ? "Imposto de Renda" : "RRA + FEPA"} - Lei 14.848/2024`;
    doc.text(titulo, margin, yPosition);
    yPosition += 10;

    // Linha divisória
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Seção: Dados do Processo
    doc.setFont("helvetica", "bold");
    addLine("Dados do Processo", "");
    doc.setFont("helvetica", "normal");
    yPosition += 2;
    const processNumber = document.getElementById("numProcess")?.value || "N/A";
    addLine("Número do Processo", formatProcessNumber(processNumber));
    addLine("Nome da parte autora", document.getElementById("parteAtiva")?.value || "N/A");
    addLine("Nome da parte ré", document.getElementById("partePassiva")?.value || "N/A");
    yPosition += 5;

    // Linha divisória entre seções
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Seção: Cálculo
    doc.setFont("helvetica", "bold");
    addLine("Cálculo", "");
    doc.setFont("helvetica", "normal");
    yPosition += 2;

    if (tipoIR === "honorarios") {
        addLine("Valor bruto do pagamento (VB)", `R$ ${dados.valorBruto.toFixed(2)}`);
        addLine("Imposto de Renda calculado (tabela progressiva)", `R$ ${resultado.imposto.toFixed(2)}`);
        addLine("Alíquota efetiva (IR / VB * 100)", `${resultado.aliquotaEfetiva}%`);
        addLine("Valor líquido (VB - IR)", `R$ ${resultado.liquido}`, 2);
    } else if (tipoIR === "fepa") {
        addLine("Período Inicial", dados.periodoInicial);
        addLine("Período Final", dados.periodoFinal);
        addLine("Quantidade de meses (n)", resultado.meses);
        addLine("Valor Bruto do RPV (VB)", `R$ ${dados.valorBruto.toFixed(2).replace('.', ',')}`);
        addLine("Média Mensal (VB / n)", `R$ ${resultado.mediaMensal.toFixed(2).replace('.', ',')}`);
        addLine("Total FEPA (soma das FEPA mensais)", `R$ ${resultado.totalFEPA.toFixed(2).replace('.', ',')}`);
        addLine("IR (RRA) (média mensal * n)", `R$ ${resultado.ir.toFixed(2).replace('.', ',')}`);
        addLine("Alíquota Efetiva (IR total / VB corrigido * 100)", `${resultado.aliquotaEfetiva}%`);
        addLine("Valor Líquido (VB - FEPA - IRRRA)", `R$ ${resultado.liquido.toFixed(2)}`, 2);
    }

    // Rodapé: Nota Explicativa posicionada no final da página
    const footerText = tipoIR === "honorarios" ?
        "Nota Explicativa: Dedução do IRRF, conforme a tabela progressiva contida na Lei nº 14.848 de 01/05/2024." :
        "Nota Explicativa: Base de Cálculo: Valor Bruto Corrigido (não incidindo juros); FEPA: 11% até 02/2020 e 7,5% a partir de 03/2020; IR (RRA): conforme Tabela Progressiva da Lei nº 14.848/2024.";

    const footerY = pageHeight - margin;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    // Ajusta o texto do rodapé para caber na largura disponível
    const splitFooter = doc.splitTextToSize(footerText, pageWidth - margin * 2);
    doc.text(splitFooter, margin, footerY - (splitFooter.length * 5));

    // Linha divisória acima do rodapé (opcional)
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - (splitFooter.length * 5) - 5, pageWidth - margin, footerY - (splitFooter.length * 5) - 5);

    // Salva o PDF com o nome adequado
    doc.save(`relatorio_${tipoIR}_${processNumber}.pdf`);
    return doc;
}
