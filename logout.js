function logOut() {
    //var user = getUserFromUsername(userInfo.username)
    firebase
        .database()
        .ref("users/" + userInfo.id)
        .update({
            cookie: "",
            cookieExpiration: "",
        })
        .then(() => {
            console.log("Cookie updated successfully");
        })
        .catch((error) => {
            console.error("Error updating cookie:", error);
        });


    document.cookie = 'logID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    window.location.href = `login.html`;
    return;
}