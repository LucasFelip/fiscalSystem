export default function calcularHonorarios({ valorBruto }) {
    let imposto = 0;

    if (valorBruto <= 2259.20) {
        imposto = 0;
    } else if (valorBruto <= 2826.65) {
        imposto = valorBruto * 0.075 - 169.44;
    } else if (valorBruto <= 3751.05) {
        imposto = valorBruto * 0.15 - 381.44;
    } else if (valorBruto <= 4664.68) {
        imposto = valorBruto * 0.225 - 662.77;
    } else {
        imposto = valorBruto * 0.275 - 896;
    }

    imposto = Math.max(0, imposto);
    const liquido = valorBruto - imposto;
    const aliquotaEfetiva = (imposto / valorBruto) * 100;

    return { imposto, aliquotaEfetiva, liquido };
}
