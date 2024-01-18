function generateUniqueString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

// Set cookie
function setCookie(name, value, days) {
    let expires = "";
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Set the expiry date to 7 days from now
    if (days) {
        expires = "; expires=" + expiryDate.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


// Usage example
//setCookie('logID', cookieValue, 7); // set cookie to expire in 7 days