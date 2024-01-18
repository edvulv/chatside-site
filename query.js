// Write user data to the database
function writeUserData(userId, username, password, cookie, contentId) {
    firebase.database().ref('users/' + userId).set({
        id: userId,
        username: username,
        password: password,
        cookie: cookie,
        contentID: contentId
    });
}

// Write content data to the database
function writeContentData(contentId, title, body) {
    firebase.database().ref('content/' + contentId).set({
        id: contentId,
        title: title,
        body: body
    });
}

// Read user data from the database
function readUser(username, password) {
    var errormessage;
    return new Promise((resolve, reject) => {
        firebase
            .database()
            .ref("users")
            .orderByChild("username")
            .equalTo(username)
            .once("value")
            .then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const user = childSnapshot.val();
                        if (user.password === password) {
                            console.log("User found:", user);
                            resolve(user);
                        } else {
                            errormessage = 42
                            displayErrorMessage(errormessage)
                            reject("Incorrect password");
                        }
                    });
                } else {
                    errormessage = 45
                    displayErrorMessage(errormessage)
                    reject("User not found");
                }
            })
            .catch((error) => {
                errormessage = 51
                displayErrorMessage(errormessage)
                console.error("Error retrieving user:", error);
                reject(error);
            });
    });
}
function getUserFromUsername(username) {
    firebase.database().ref('users').orderByChild('username').equalTo(username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                var userReturned
                snapshot.forEach((childSnapshot) => {
                    userReturned = {
                        id: userId,
                        username: user.username,
                        email: user.email,
                        contentID: user.contentID,
                        cookie: user.cookie,
                        cookieExpiration: user.cookieExpiration
                    };
                });
                return userReturned
            }
        });
}function getUserFromId(id) {
    firebase.database().ref('users').orderByChild('id').equalTo(id).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                var userReturned
                snapshot.forEach((childSnapshot) => {
                    userReturned = {
                        id: userId,
                        username: user.username,
                        email: user.email,
                        contentID: user.contentID,
                        cookie: user.cookie,
                        cookieExpiration: user.cookieExpiration
                    };
                });
                return userReturned
            }
        });
}

/*
var users
firebase.database().ref('users/' + userID).once('value').then(function(snapshot) {
    users = snapshot.val();
    console.log(users);
});

 */

// Read content data from the database
firebase.database().ref('content').once('value').then(function(snapshot) {
    var content = snapshot.val();
    console.log(content);
});