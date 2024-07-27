document.getElementById('validateButton').addEventListener('click', function () {
    const input = document.getElementById('inputArea').value.trim();
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = '';

    if (input === '') {
        return;
    }

    const lines = input.split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
        const result = validateIdNumber(line);
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';
        resultDiv.textContent = result.message;
        resultDiv.style.color = result.color;
        resultArea.appendChild(resultDiv);
    });
});

function validateIdNumber(idNumber) {
    // 1. 检查非法字符
    if (/[^\dXx]/.test(idNumber)) {
        return { message: `${idNumber} 含有非法字符`, color: 'red' };
    }

    // 2. 检查长度
    if (idNumber.length < 17 || idNumber.length > 18) {
        return { message: `${idNumber} 长度错误`, color: 'red' };
    }

    // 3. 检查前17位是否有 X/x
    if (idNumber.substring(0, 17).search(/X|x/) >= 0) {
        return { message: `${idNumber} X位置错误`, color: 'red' };
    }

    // 4. 如果是17位，计算18位
    if (idNumber.length === 17) {
        const calculatedCheckDigit = calculateCheckDigit(idNumber);
        return { message: `${idNumber}${calculatedCheckDigit} 校验位计算`, color: 'yellow' };
    }

    // 5. 如果是18位，进行校验操作
    const id17 = idNumber.substring(0, 17);
    const inputCheckDigit = idNumber[17].toUpperCase();
    const calculatedCheckDigit = calculateCheckDigit(id17);

    if (inputCheckDigit === calculatedCheckDigit) {
        if (idNumber[17] === 'x') {
            return { message: `${idNumber.substring(0, 17)}X 小写更正`, color: 'purple' };
        } else {
            return { message: `${idNumber} 校验正确`, color: 'green' };
        }
    } else {
        return { message: `${idNumber} 校验位 ${idNumber[17]} 与计算结果 ${calculatedCheckDigit} 不匹配`, color: 'red' };
    }
}

function calculateCheckDigit(id17) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkChars = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    const sum = id17.split('').reduce((acc, num, idx) => acc + (parseInt(num) * weights[idx]), 0);
    const mod = sum % 11;
    return checkChars[mod];
}
