const inputSlider = document.querySelector("[data-slider]");
const lengthDisplay = document.querySelector("[data-lengthNum]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatePassword = document.querySelector(".Generatepass");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+{}[]><?/-= ';
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc")

// Sets initial password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min= inputSlider.min;
    const max = inputSlider.max;
    const value = inputSlider.value;
    const percentage = ((value - min) * 100) / (max - min);

  inputSlider.style.background = `linear-gradient(to right, #4CAF50 ${percentage}%, #ccc ${percentage}%)`;
}

// Set indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow ='0px 0px 12px 1px ${color}';
}

// Get random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random number
function getRandomNum() {
    return getRandomInt(0, 9);
}

// Generate random lowercase letter
function generateLowerCase() {
    return String.fromCharCode(getRandomInt(97, 122));
}

// Generate random uppercase letter
function generateUpperCase() {
    return String.fromCharCode(getRandomInt(65, 90));
}

// Generate random symbol
function generateSymbol() {
    const randNum = getRandomInt(0, symbols.length - 1);
    return symbols.charAt(randNum);
}

// Calculate password strength
function calcStrength() {
    let hasUpper = uppercasecheck.checked;
    let hasLower = lowercasecheck.checked;
    let hasNum = numbercheck.checked;
    let hasSymb = symbolcheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSymb) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSymb) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// Copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Shuffle password
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Handle checkbox changes
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if (checkbox.checked) checkCount++;
    });
}

allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

generatePassword.addEventListener('click', () => {
    if (checkCount == 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funcArr = [];

    if (uppercasecheck.checked) funcArr.push(generateUpperCase);
    if (lowercasecheck.checked) funcArr.push(generateLowerCase);
    if (numbercheck.checked) funcArr.push(getRandomNum);
    if (symbolcheck.checked) funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInt(0, funcArr.length - 1);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
