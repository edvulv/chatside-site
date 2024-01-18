function getErrorMessage() {
    // Get the error message number from the URL parameter
    const params = new URLSearchParams(window.location.search);
    const errorMessageNumber = params.get('errormssg');
    console.log(errorMessageNumber)

    // Display the error message if the parameter exists
    if (errorMessageNumber) {
        displayErrorMessage(errorMessageNumber);
    }
}

function displayErrorMessage(number) {
    const errorMessage = getErrorMessageFromNumber(number);
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerHTML = errorMessage;
    errorMessageElement.classList.remove('hidden');
}


function getErrorMessageFromNumber(number) {
    // Define the error messages for each number
    switch (number) {
        case 42:
            return 'Invalid username or password.';
        case 43:
            return 'Failed to retrieve user data.';
        case 44:
            return 'Invalid or expired cookie.';
        case 45:
            return 'User not found in the database.';
        case 46:
            return 'Invalid email format.';
        case 47:
            return 'Username already taken.';
        case 48:
            return 'Password must be at least 6 characters long.';
        case 49:
            return 'Email already in use.';
        case 50:
            return 'Error updating user data.';
        case 51:
            return 'Error retrieving user data. Please try again later.';
        case 52:
            return 'Cookie does not exist or is not valid';
        case 99:
            return 'User account is disabled or suspended. Please contact support for further assistance.';
        case 100:
            return 'Invalid or expired password reset token. Please request a new password reset email and try again.';
        case 101:
            return 'Invalid password. Please try again with a different password.';
        // Add more cases for other error message numbers here
        default:
            return 'An error occurred.';
    }
}


window.onload = function () {
    getErrorMessage();
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerHereBtn = document.getElementById('register-here-btn');
    const loginInsteadBtn = document.getElementById('login-instead-btn');



    // Add event listener to "Register Here" button
    registerHereBtn.addEventListener('click', (event) => {
        event.preventDefault();
        loginForm.classList.add('slide-out-left');
        loginForm.classList.remove('slide-in-left');
        registerForm.classList.add('slide-in-right');
        registerForm.classList.remove('slide-out-right');
        setTimeout(() => {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }, 500);
    });

    // Add event listener to "Login Instead" button
    loginInsteadBtn.addEventListener('click', (event) => {
        event.preventDefault();
        loginForm.classList.add('slide-in-left');
        loginForm.classList.remove('slide-out-left');
        registerForm.classList.add('slide-out-right');
        registerForm.classList.remove('slide-in-right');
        setTimeout(() => {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }, 500);
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault()
        loginValidate()
    })

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault()
        registerValidate()
    })

    // Add event listener to remove "incorrect" class and hide "error-message" when user starts typing
    loginForm.addEventListener('input', (event) => {
        const input = event.target;
        if (input.classList.contains('incorrect')) {
            input.classList.remove('incorrect');
            const errorMessage = document.querySelector('.error-message');
            errorMessage.style.display = 'none';
        }
    });

}

async function loginValidate() {
    event.preventDefault();
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const errorMessage = document.querySelector(".error-message");

    try {
        const user = await readUser(usernameInput.value, passwordInput.value);
        // The login information is correct, so create a new cookie using the script from earlier
        const cookie = generateUniqueString();
        // and assign it to the existing user account
        const userId = user.id;
        firebase
            .database()
            .ref("users/" + userId)
            .update({
                cookie: cookie,
                cookieExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .then(() => {
                console.log("Cookie updated successfully");
            })
            .catch((error) => {
                console.error("Error updating cookie:", error);
            });
        // Set the cookie to expire in 7 days
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        setCookie('logID', cookie, expirationDate);

        // Then, redirect to home.html
        window.location.href = "home.html";
    } catch (error) {
        usernameInput.classList.add("incorrect");
        passwordInput.classList.add("incorrect");
        errorMessage.style.display = "block";
    }
}

async function registerValidate() {
    event.preventDefault();
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");
    const emailInput = document.getElementById("register-email");
    const errorMessage = document.querySelector(".error-message");

    // Check if email is valid
    if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        // Error: Invalid email format
        displayErrorMessage(46)
        console.log('Invalid email format');
        return;
    }

    // Check if password is at least 5 characters long
    if (passwordInput.value.length < 6) {
        displayErrorMessage(48)
        console.log('Password too short');
        return;
    }

    try {
        // Check if username is taken
        const user = await getUserFromUsername(usernameInput.value);
        if (user) {
            // Error: Username already exists
            displayErrorMessage(47)
            console.log('Username already exists');
            return;
        }

        // If all checks pass, continue with user creation process
        console.log('User creation process can continue');
        // TODO: Add user creation logic here
        var id = generateUniqueString()
        var cookie = generateUniqueString()
        var expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        var newUser = {
            contentID: id,
            cookie: cookie,
            cookieExpiration: expirationDate,
            email: emailInput.value,
            id: id,
            password: passwordInput.value,
            username: usernameInput.value,
        };

        console.log("5")
        firebase.database().ref('users/' + id).set(newUser)
            .then(() => {
                console.log("New user created successfully");
                // Continue coding here
                setCookie('logID', cookie, "");
                /*firebase.database().ref('content/' + id).set(newUser)
                    .then(() => {
                        console.log("New user created successfully");
                        // Continue coding here
                        setCookie('logID', cookie, "");

                        // Then, redirect to home.html
                        window.location.href = "home.html";
                    })
                    .catch((error) => {
                        console.error("Error creating new user:", error);
                        displayErrorMessage(50)
                        return
                        // Handle error here
                    });*/

                // Then, redirect to home.html
                window.location.href = "home.html";
            })
            .catch((error) => {
                console.error("Error creating new user:", error);
                displayErrorMessage(50)
                return
                // Handle error here
            });
    } catch (error) {
        usernameInput.classList.add("incorrect");
        displayErrorMessage(50)
    }
}