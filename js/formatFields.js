export function aplicarFormatacao() {
    const currencyInputs = document.querySelectorAll('.currency-input');
    currencyInputs.forEach(input => {
        IMask(input, {
            mask: Number,
            scale: 2,
            signed: false,
            thousandsSeparator: '.',
            padFractionalZeros: true,
            normalizeZeros: true,
            radix: ',',
            mapToRadix: ['.']
        });
    });

    const dateInputs = document.querySelectorAll('.date-input');
    dateInputs.forEach(input => {
        IMask(input, { mask: '00/0000' });
    });
}

/**
 * Formata o número do processo para o padrão esperado.
 * @param {string} num
 * @returns {string}
 */
const formatProcessNumber = (num) => {
    const digits = num.replace(/\D/g, '');
    if (digits.length === 20) {
        return `${digits.substr(0, 7)}-${digits.substr(7, 2)}.${digits.substr(9, 4)}.${digits.substr(13, 1)}.${digits.substr(14, 2)}.${digits.substr(16, 4)}`;
    }
    return num;
};

/**
 * Formata o valor do CRC.
 * Se o CRC seguir o padrão (5 a 6 dígitos + "/O-" + 1 dígito) ele é exibido com o prefixo "CRC-MA".
 * @param {string} crc
 * @returns {string}
 */
export function formatarCRC(crc) {
    if (!crc) return "CRC N/A";
    const regex = /(\d{5,6}\/O-\d)/;
    const match = crc.match(regex);
    return match ? `CRC-MA ${match[0]}` : crc;
}

document.addEventListener('DOMContentLoaded', () => {
    aplicarFormatacao();
    const processInput = document.getElementById('numProcess');
    if (processInput) {
        processInput.addEventListener('blur', () => {
            processInput.value = formatProcessNumber(processInput.value);
        });
    }
});
