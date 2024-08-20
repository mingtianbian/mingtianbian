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

function validateIdNumber(idNumber, areaCodeMap) {
    // 1. 检查非法字符
    if (/[^0-9xX]/.test(idNumber)) {
        return [idNumber + " 含有非法字符", "red"];
    }

    // 2. 检查长度，并在错误时提供当前位数
    const length = idNumber.length;
    if (length < 17 || length > 18) {
        return [idNumber + " 长度错误：当前长度为 " + length + " 位", "red"];
    }

    // 3. 检查前17位是否有 X/x
    if (idNumber.substring(0, 17).includes('x') || idNumber.substring(0, 17).includes('X')) {
        return [idNumber + " X位置错误", "red"];
    }

    // 4. 检查生日
    const birthDate = idNumber.substring(6, 14);
    if (!isValidDate(birthDate)) {
        return [idNumber + " 出生日期无效", "red"];
    }

    // 5. 检查区域代码
    const areaCode = idNumber.substring(0, 6);
    if (!areaCodeMap.has(areaCode)) {
        return [idNumber + " 区域代码无效（1980-2023年区域版本）", "#90EE90"];
    }

    // 6. 如果是17位，计算18位
    if (length === 17) {
        const calculatedCheckDigit = calculateCheckDigit(idNumber);
        return [idNumber + calculatedCheckDigit + " 校验位计算", "#9ACD32"];
    }

    // 7. 如果是18位，进行校验操作
    const id17 = idNumber.substring(0, 17);
    const inputCheckDigit = idNumber[17];
    const calculatedCheckDigit = calculateCheckDigit(id17);

    if (isValidId(idNumber)) {
        return [idNumber + " 校验正确", "green"];
    } else if (inputCheckDigit.toLowerCase() === "x" && calculatedCheckDigit === "X") {
        const correctedLine = id17 + "X";
        return [correctedLine + " 小写更正", "#8E2A9F"]; // Purple color
    } else {
        return [idNumber + " 校验位错误（[" + inputCheckDigit + "]与[" + calculatedCheckDigit + "]）", "red"];
    }
}

// 验证日期有效性
function isValidDate(date) {
    if (date.length !== 8) return false;

    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10);
    const day = parseInt(date.substring(6, 8), 10);

    // 检查年份是否大于1800
    if (year <= 1800) return false;

    if (month < 1 || month > 12) return false;

    const maxDay = (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) ? 31 :
                    (month === 4 || month === 6 || month === 9 || month === 11) ? 30 :
                    (isLeapYear(year) ? 29 : 28);

    return day >= 1 && day <= maxDay;
}

// 判断是否为闰年
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function calculateCheckDigit(id17) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkChars = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    const sum = id17.split('').reduce((acc, char, index) => acc + (parseInt(char, 10) * weights[index]), 0);
    const mod = sum % 11;
    return checkChars[mod];
}

function isValidId(id) {
    if (id.length !== 18) return false;

    const id17 = id.substring(0, 17);
    const checkDigit = id[17];

    return calculateCheckDigit(id17) === checkDigit;
}

function formatBirthDate(birthDate) {
    const year = birthDate.substring(0, 4);
    const month = parseInt(birthDate.substring(4, 6), 10);
    const day = parseInt(birthDate.substring(6, 8), 10);

    return `${year}年${month}月${day}日`;
}

function getDetailedInfo(idNumber, areaCodeMap) {
    if (idNumber.includes("错误") || idNumber.includes("非法字符")) {
        return idNumber;
    }

    const areaCode = idNumber.substring(0, 6);
    const birthDate = idNumber.substring(6, 14);
    const genderCode = parseInt(idNumber[16], 10);
    const gender = (genderCode % 2 === 0) ? "女" : "男";

    // 将出生日期转换为“xxxx年xx月xx日”格式
    const formattedBirthDate = formatBirthDate(birthDate);

    // 解析省市区信息
    const fullAreaName = getFullAreaName(areaCode, areaCodeMap);

    return `
        号码: ${idNumber}
        区域: ${fullAreaName}
        出生日期: ${formattedBirthDate}
        性别: ${gender}
    `;
}

// 获取完整的省市区信息
function getFullAreaName(areaCode, areaCodeMap) {
    const provinceCode = areaCode.substring(0, 2) + "0000";
    const cityCode = areaCode.substring(0, 4) + "00";

    const provinceName = areaCodeMap.get(provinceCode) || "未知省份";
    const cityName = areaCodeMap.get(cityCode) || "未知城市";
    const districtName = areaCodeMap.get(areaCode) || "未知区域";

    if (provinceName === "北京市" || provinceName === "天津市" || provinceName === "上海市" || provinceName === "重庆市") {
        return `${provinceName}-${districtName}`;
    } else {
        return `${provinceName}-${cityName}-${districtName}`;
    }
}
