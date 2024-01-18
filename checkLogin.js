let userInfo; // global variable to store user information

function checkCookie() {
    var LOGIN_COOKIE_ERROR; // set to the appropriate error code
    // Check if the logID cookie exists
    console.log("1")
    const logID = getCookie('logID');
    console.log(logID)

    if (!logID) {
        // If the logID cookie does not exist, redirect to login page with error message
        LOGIN_COOKIE_ERROR = 44
        window.location.href = `login.html?errormssg=${LOGIN_COOKIE_ERROR}`;
        return;
    }

    console.log("2")
    // Retrieve user data from the database using the cookie value
    firebase.database().ref('users').orderByChild('cookie').equalTo(logID.value).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log("3")
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    const userId = childSnapshot.key;
                    console.log('User found:', user);

                    // Check if the cookie has expired (set the expiration time to 30 minutes)
                    const expirationTime = Date.parse(user.cookieExpiration);
                    const currentTime = new Date().getTime();
                    if (isNaN(expirationTime)) {
                        // If the expiration time is not a valid date, remove the cookie and redirect to login page with error message
                        LOGIN_COOKIE_ERROR = 44
                        document.cookie = 'logID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
                        window.location.href = `login.html?errormssg=${LOGIN_COOKIE_ERROR}`; //&kuk=2
                        return;
                    } else if (currentTime > expirationTime) {
                        // If the cookie has expired, remove the cookie and redirect to login page with error message
                        LOGIN_COOKIE_ERROR = 44
                        document.cookie = 'logID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
                        window.location.href = `login.html?errormssg=${LOGIN_COOKIE_ERROR}`;
                        return;
                    }
                    let img = ""

                    storage.ref(`${userId}/profileimg`).getDownloadURL().then(function(url) {
                        img = url

                        console.log("4")
                        // If the cookie is still valid, save the user attributes in a global variable
                        userInfo = {
                            id: userId,
                            username: user.username,
                            email: user.email,
                            contentID: user.contentID,
                            img: img
                        };

                        // functionToCall()
                        window.connectAndCheckCompleted = true
                        // Do something with the user information, e.g. display it on the page
                        console.log(userInfo);
                    }).catch(function(error) {
                        console.error('Det oppsto en feil ved henting av bilde:', error);
                    });
                });
            } else {
                // If the cookie does not match any user in the database, remove the cookie and redirect to login page with error message
                LOGIN_COOKIE_ERROR = 52
                document.cookie = 'logID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
                window.location.href = `login.html?errormssg=${LOGIN_COOKIE_ERROR}`;
                return;
            }
        })
        .catch((error) => {
            console.error('Error retrieving user:', error);
            LOGIN_COOKIE_ERROR = 52
            // If there is an error, remove the cookie and redirect to login page with error message
            document.cookie = 'logID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
            window.location.href = `login.html?errormssg=${LOGIN_COOKIE_ERROR}`;
            return;
        });
}



// Function to retrieve the value and expiry date of a cookie
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return { value: cookie[1], expiry: parseInt(cookie[2]) };
        }
    }
    return null;
}
