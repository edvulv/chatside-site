// Call the functions in the desired order
var connectAndCheckCompleted = false
window.onload = function() {
    // code to be executed after the page has finished loading
    connectDB();
    checkCookie(connectAndCheckCompleted);
};

