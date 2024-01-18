//var connectAndCheckCompleted = window.connectAndCheckCompleted;

function waitForCompletion() {
    const interval = setInterval(() => {
        if (window.connectAndCheckCompleted) {
            clearInterval(interval);
            // Do something here after connectAndCheckCompleted is true
            console.log("Connect and check completed!");
            GiveInfos()
        }
    }, 100); // Check every 100 milliseconds
}

waitForCompletion(); // Call this function to start waiting for completion

function GiveInfos() {
    var nameus = userInfo.username
    console.log(nameus)
    var usernams = document.getElementsByClassName("username") // = window.userInfo.username
    var profilpics = document.getElementsByClassName("profile-pic") // = window.userInfo.username
    console.log(profilpics)
    Array.from(usernams).forEach(name => {
        name.textContent = userInfo.username
    })
    console.log(userInfo.img)
    Array.from(profilpics).forEach(img => {
        if (img instanceof HTMLImageElement) {
            img.src = userInfo.img; // Antar at userInfo.img inneholder den nye bilde-URL-en
        }
    });
    console.log(usernams)
}