import { getLocalStorage } from "./localStorage.js";

export function checkNumber(value) {
    const num = parseInt(value);
    return num ? true : false;
}

export function checkDivideTen(value) {
    return parseInt(value) % 10 === 0 ? true : false;
}

export function checkString(value) {
    const checkReg = /[가-힣|\w]+/g;
    return checkReg.test(value);
}

export function checkProductName(value) {
    const keys = getLocalStorage("Product");
    for (const key of Object.keys(keys)) if (value === key) return false;
    return true;
}
