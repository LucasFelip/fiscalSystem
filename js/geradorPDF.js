export default function gerarPDF(tipoIR, resultado, dados) {
    if (!window.jspdf) {
        console.error("Biblioteca jsPDF não carregada!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPosition = 15;

    const addLine = (text, value, ln = 1) => {
        doc.text(20, yPosition, `${text}: ${value}`);
        yPosition += 7 * ln;
    };

    doc.setFontSize(14);
    doc.text(20, 10, `Cálculo de ${tipoIR === "honorarios" ? "Imposto de Renda" : "RRA + FEPA"} - Lei 14.848/2024`);
    doc.setFontSize(12);
    yPosition = 20;

    addLine("Número do Processo", document.getElementById("numProcess")?.value || "N/A");
    addLine("Nome da parte autora", document.getElementById("parteAtiva")?.value || "N/A");
    addLine("Nome da parte ré", document.getElementById("partePassiva")?.value || "N/A");

    if (tipoIR === "honorarios") {
        addLine("Valor bruto do pagamento", `R$ ${dados.valorBruto.toFixed(2)}`);
        addLine("Imposto de Renda calculado", `R$ ${resultado.imposto}`);
        addLine("Alíquota efetiva", `${resultado.aliquotaEfetiva}%`);
        addLine("Valor líquido", `R$ ${resultado.liquido}`, 2);

        doc.setFont("", "bold");
        doc.text(20, yPosition, "Nota Explicativa:");
        doc.setFont("", "normal");
        yPosition += 7;
        doc.text(20, yPosition, "Dedução do IRRF, conforme a tabela progressiva contida na Lei nº 14.848 de 01/05/2024.");

    } else if (tipoIR === "fepa") {
        addLine("Período Inicial", dados.periodoInicial);
        addLine("Período Final", dados.periodoFinal);
        addLine("Quantidade de meses (RRA)", resultado.meses);
        addLine("Valor Bruto do RPV", `R$ ${dados.valorBruto.toFixed(2).replace('.', ',')}`);
        addLine("Média Mensal", `R$ ${resultado.mediaMensal.toFixed(2).replace('.', ',')}`);
        addLine("Total FEPA", `R$ ${resultado.fepa.toFixed(2).replace('.', ',')}`);
        addLine("IR (RRA)", `R$ ${resultado.ir.toFixed(2).replace('.', ',')}`);
        addLine("Alíquota Efetiva", `${resultado.aliquotaEfetiva}%`, 2);
        addLine("Valor Líquido", `R$ ${resultado.liquido}`, 2);

        doc.setFont("", "bold");
        doc.text(20, yPosition, "Nota Explicativa:");
        doc.setFont("", "normal");
        yPosition += 7;
        doc.text(20, yPosition, "Base de Cálculo: Valor Bruto Corrigido, pois não há incidência sobre os juros.");
        yPosition += 7;
        doc.text(20, yPosition, "FEPA: 11% até 02/2020 e 7,5% a partir de 03/2020.");
        yPosition += 7;
        doc.text(20, yPosition, "IR (RRA): De acordo com a Tabela Progressiva da Lei nº 14.848/2024, calculado pela média mensal.");
    }

    doc.save(`relatorio_${tipoIR}.pdf`);
    return doc;
}
