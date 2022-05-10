export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setObjectLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
