function getSignatureInfo() {
    // Recupera o usuário logado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        return { nome: "N/A", crc: "N/A", dataHora: "N/A", hash: "N/A" };
    }
    const nome = usuarioLogado.nomeCompleto;
    const crc = usuarioLogado.crc;
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
    // Data e hora detalhada em uma única chamada
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

    // ──────────────── Cabeçalho ────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ESTADO DO MARANHÃO", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 7;
    doc.text("PROCURADORIA GERAL DO ESTADO", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // ──────────────── Título do Relatório  ────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RELATÓRIO OFICIAL", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const titulo = `Cálculo de ${tipoIR === "honorarios" ? "Imposto de Renda" : "RRA + FEPA"} - Lei 14.848/2024`;
    doc.text(titulo, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    // Linha divisória
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // ──────────────── Dados do Processo ────────────────
    doc.setFont("helvetica", "bold");
    doc.text("Dados do Processo", margin, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    const processNumber = document.getElementById("numProcess")?.value || "N/A";
    function formatProcessNumber(num) {
        const digits = num.replace(/\D/g, '');
        if (digits.length !== 20) return num;
        return `${digits.substr(0,7)}-${digits.substr(7,2)}.${digits.substr(9,4)}.${digits.substr(13,1)}.${digits.substr(14,2)}.${digits.substr(16,4)}`;
    }
    doc.text(`Número do Processo: ${formatProcessNumber(processNumber)}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Nome da parte autora: ${document.getElementById("parteAtiva")?.value || "N/A"}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Nome da parte ré: ${document.getElementById("partePassiva")?.value || "N/A"}`, margin, yPosition);
    yPosition += 10;
    // Linha divisória entre seções
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // ──────────────── Cálculo ────────────────
    doc.setFont("helvetica", "bold");
    doc.text("Cálculo", margin, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    if (tipoIR === "honorarios") {
        doc.text(`Valor bruto do pagamento (VB): R$ ${dados.valorBruto.toFixed(2)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Imposto de Renda calculado (tabela progressiva): R$ ${resultado.imposto.toFixed(2)}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Alíquota efetiva (IR / VB * 100): ${resultado.aliquotaEfetiva}%`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor líquido (VB - IR): R$ ${resultado.liquido}`, margin, yPosition);
        yPosition += 10;
    } else if (tipoIR === "fepa") {
        doc.text(`Período Inicial: ${dados.periodoInicial}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Período Final: ${dados.periodoFinal}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Quantidade de meses (n): ${resultado.meses}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Bruto do RPV (VB): R$ ${dados.valorBruto.toFixed(2).replace('.', ',')}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Média Mensal (VB / n): R$ ${resultado.mediaMensal.toFixed(2).replace('.', ',')}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Total FEPA (soma das FEPA mensais): R$ ${resultado.totalFEPA.toFixed(2).replace('.', ',')}`, margin, yPosition);
        yPosition += 7;
        doc.text(`IR (RRA) (média mensal * n): R$ ${resultado.ir.toFixed(2).replace('.', ',')}`, margin, yPosition);
        yPosition += 7;
        doc.text(`Alíquota Efetiva (IR total / VB corrigido * 100): ${resultado.aliquotaEfetiva}%`, margin, yPosition);
        yPosition += 7;
        doc.text(`Valor Líquido (VB - FEPA - IRRRA): R$ ${resultado.liquido.toFixed(2)}`, margin, yPosition);
        yPosition += 10;
    }

    // ──────────────── Nota Explicativa ────────────────
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    const noteText = tipoIR === "honorarios" ?
        "Nota Explicativa: Dedução do IRRF, conforme a tabela progressiva contida na Lei nº 14.848 de 01/05/2024." :
        "Nota Explicativa: Base de Cálculo: Valor Bruto Corrigido (não incidindo juros); FEPA: 11% até 02/2020 e 7,5% a partir de 03/2020; IR (RRA): conforme Tabela Progressiva da Lei nº 14.848/2024.";
    const splitNote = doc.splitTextToSize(noteText, pageWidth - margin * 2);
    doc.text(splitNote, margin, yPosition);
    yPosition += (splitNote.length * 5) + 5;

    // ──────────────── Rodapé ────────────────
    // Define posição de início para o rodapé
    const footerStartY = pageHeight - margin - 40;
    const pgeLocation = "PGE - Av. Presidente Juscelino Lote 25, Quadra 22, Quintas do Calhau - São Luís/MA";
    const pgeContact = "Tel.: (98) 3235-6767 - Site: pge.ma.gov.br";
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(pgeLocation, pageWidth / 2, footerStartY, { align: "center" });
    doc.text(pgeContact, pageWidth / 2, footerStartY + 7, { align: "center" });

    // Exibe a assinatura digital
    const assinatura = getSignatureInfo();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Assinado digitalmente por ${assinatura.nome}`, margin, footerStartY + 25);
    doc.text(`CRC: ${assinatura.crc}`, margin, footerStartY + 30);
    doc.text(`Data e Hora: ${assinatura.dataHora}`, margin, footerStartY + 35);
    //doc.text(`Localizador do documento: ${assinatura.hash}`, margin, footerStartY + 35);

    // Salva o PDF com o nome adequado
    doc.save(`relatorio_${tipoIR}_${processNumber}.pdf`);
    return doc;
}
