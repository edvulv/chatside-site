function generateRandomString() {
    const getRandomNumber = () => Math.floor(Math.random() * 10).toString();
    const getRandomLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);

    let randomString = "li"; // Starting with "li"
for (let i = 0; i < 2; i++) {
    randomString += getRandomNumber();
}
for (let i = 0; i < 2; i++) {
    randomString += getRandomLetter();
}
for (let i = 0; i < 2; i++) {
    randomString += getRandomNumber();
}

return randomString;
}

console.log(generateRandomString()); // Example output: "li023ok84"
