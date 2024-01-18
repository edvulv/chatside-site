function month(input) {
    switch (input) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default:
            return "Invalid input";
    }
}

/*for (let i = 1; i <= 12; i++) {
    console.log(`Month ${i}: ${month(i)}`);
}*/

function formatToRead(input, simple) {
    console.log(input)
    let dates = input.split("-")
    //YYYY-MM-DD
    var Month = month(parseInt(dates[1]));
    if (simple === true) {
        return Month + " " + dates[0]
    } else {
        return dates[2] + " " + Month + " " + dates[0]
    }
}

function findImage(imagefromdb) {
    var image = ""
    if (imagefromdb === "none") {
        image = "none.png"
    } else if (imagefromdb === "default") {
        image = "notfound.png"
    } else {
        image = imagefromdb
    }
    return image
}