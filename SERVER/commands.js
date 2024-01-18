let input;
let button;
let serverStop = false;
let serverInfo = []
var updateTime;
var handleRequestPRV; //PerRequestV
var newUpdateDetected = false;
var lastError = ''
let asnwerPropmt = false
let answerDigit = 0



document.addEventListener("DOMContentLoaded", function(event) {
    input = document.getElementById("inputconsole");
    button = document.getElementById("inputbutton");
    button.addEventListener("click", handleInput);
    input.addEventListener("keypress", handleInputKeypress);
});

function returnAnswer(answer) {
    if (answer === true) {
        answerDigit = 1
    } else {
        answerDigit = -1
    }
}

async function handleInput(text=null) {
    window.answerDigit = 0
    // Code to be executed when the user submits the input
    let userInput = input.value.trim(); // Remove leading/trailing whitespace
    let prompresponse;
    if (input.value.length > 0) {
        if (asnwerPropmt === true) {
            userInput = text
            console.log(userInput)
        }
        const words = userInput.split(" ");
        const commandName = words[0];
        const subCommand = words.length > 1 ? words[1] : "";
        let commandList = commands[0].commands
        let responseList = commands[0].response
        displayInHtmlConsole(createHTMLelement("<>:" + input.value))

        // Check if the command is "start server" and has a corresponding response
        console.log(commandList.start.server)

        input.value = ""; // Clear the input field

        if (commandName === "start") {
            if (subCommand === "server" && responseList.start.server) {
                responseList = responseList.start.server
                if (words.length > 2) {
                    // Check if the user included a server ID in the input
                    if (words[2].includes("p:")) {
                        const portMatch = words[2].match(/p:(\d+)/);
                        const port = portMatch ? portMatch[1] : null;

                        const updateMatch = words[2].match(/u:(\d+)/);
                        const updateTimeM = updateMatch ? updateMatch[1] : null;

                        const requestIdMatch = words[2].match(/r:(\d+)/);
                        const requestCheck = requestIdMatch ? requestIdMatch[1] : null;
                        try {
                            console.log(`port: ${port}, userId: ${updateTimeM}, requestId: ${requestCheck}`);
                            if (port.toString().length === 6 && updateTimeM > 10 && (requestCheck > 0 && requestCheck < 1000)) {
                                serverStop = false
                                displayInHtmlConsole(createHTMLelement(`Starting server at port ${port}, with updateTime set to ${updateTimeM} and requests per listen set to ${requestCheck}`))
                                updateTime = updateTimeM;
                                handleRequestPRV = requestCheck
                                window.startServer(port, false)
                                return;
                            } else {
                                console.log(responseList.default); // Log the default response to the console
                                displayInHtmlConsole(createHTMLelement("Invalid, port needs 6 digits, updateTime must be over 10ms, and requests pr check must me over 0 and less than 1000", "red"))
                                return;
                            }
                        } catch (error) {
                            lastError = error
                            displayInHtmlConsole(createHTMLelement("Something went wrong", "red"))
                            return
                        }
                    }
                } else {
                    console.log(responseList[""]); // Log the default response to the console
                    serverStop = false
                    displayInHtmlConsole(createHTMLelement("Starting server at port 000000"))
                    updateTime = 5000;
                    handleRequestPRV = 10
                    window.startServer("000000", false)
                    return;
                }
            }
        } if (commandName === "check") {
            if (subCommand === "server" && responseList.check.server) {
                responseList = responseList.check.server;
                checkServers()
                return;
            }
        } if (commandName === "ping") {
            if (words.length === 1) {
                displayInHtmlConsole(createHTMLelement("Pinging server, await answer", "blue"))
                try {
                    const response = await ping();
                    const returnedanswer = await awaitSuccess(response);
                    displayInHtmlConsole(createHTMLelement("pong", "green"))
                    return;
                } catch (error) {
                    lastError = error
                    displayInHtmlConsole(createHTMLelement("server did not respond", "red"))
                    return;
                }
            }
        } if (commandName === "server") {
            if (subCommand === "status" && responseList.server.status) {
                if (words.length === 3 && words[2].includes("this.server")) {
                    if (serverInfo.hasOwnProperty("port")) {
                        displayInHtmlConsole(createHTMLelement("You are running a server at port " + serverInfo.port, "yellow"))
                        return
                    } else {
                        displayInHtmlConsole(createHTMLelement("No Server is connected to", "purple"))
                        return;
                    }
                } else {
                    if (window.server !== null) {
                        displayInHtmlConsole(createHTMLelement("A server is currently running", "purple"))
                        return;
                    } else {
                        displayInHtmlConsole(createHTMLelement("No Server is up", "blue"))
                        return;
                    }
                }
            } else
            if (subCommand === "create" && responseList.server.create) {
                if (words.length > 2) {
                    // Check if the user included a server ID in the input
                    var checkedwords = 0
                    Array.from(words).forEach((subsub) => {
                        if (subsub.includes("request")) {
                            checkedwords += 1
                        }
                        if (subsub.includes("ping") && checkedwords > 0) {
                            checkedwords += 1;
                        }
                    })
                    if (checkedwords === 2) {
                        try {
                            const response = await createRequest("rq_ping");
                            const returnedanswer = await awaitSuccess(response);
                            displayInHtmlConsole(createHTMLelement("request was successfull", "green"))
                            return;
                        } catch (error) {
                            lastError = error
                            displayInHtmlConsole(createHTMLelement("failed", "red"))
                            return;
                        }
                    }
                }
            }
            if (subCommand === "connect" && responseList.server.connect) {
                if (words.length === 3 && words[2].includes("p:")) {
                    serverStop = false
                    const portMatch = words[2].match(/p:(\d+)/);
                    const port = portMatch ? portMatch[1] : null;

                    if (!serverInfo.hasOwnProperty("port")) {
                        await firebase.database().ref("servers/server:" + port)
                            .orderByChild('port').equalTo(port)
                            .once('value')
                            .then((snapshot) => {
                                const response = snapshot.val();
                                if (response !== null && response !== undefined) {
                                    console.log(response.server.port)
                                    displayInHtmlConsole(createHTMLelement("Server found! Starting server", "purple"))
                                    updateTime = response.server.updateTime
                                    handleRequestPRV = response.server.requestsPerCheck
                                    window.startServer(port, false)
                                    return;
                                } else {
                                    displayInHtmlConsole(createHTMLelement("Server not found", "red"))
                                    return;
                                }
                            })
                            .catch((error) => {
                                lastError = error
                                displayInHtmlConsole(createHTMLelement("Error finding server: ", "red"))
                                return;
                            });
                    } else {
                        displayInHtmlConsole(createHTMLelement("A server is already running on your device ", "yellow"))
                        return;
                    }
                    /*

                    firebase.database().ref('ping').once('value').then(function (snapshot) {
                        const pong = snapshot.val();
                        console.log(pong)
                        if (pong === "pong") {
                            return true;
                        } else return false;
                    });*/
                    return;
                } else {
                    const snapshot = await firebase.database().ref("servers").limitToFirst(1).once("value");
                    let server = snapshot.val()
                    let serverObject = Object.values(server)[0].server
                    if (snapshot && server !== null && server !== undefined) {//server !== null && server !== undefined
                        // Using dot notation
                        var port = serverObject.port
                        displayInHtmlConsole(createHTMLelement("Server found at port " + port + "! Starting server", "purple"))
                        updateTime = serverObject.updateTime
                        handleRequestPRV = serverObject.requestsPerCheck
                        window.startServer(port, false)
                        return;
                    } else {
                        displayInHtmlConsole(createHTMLelement("No server found, there might not be an existing server yet", "red"))
                        return;
                    }
                }
            }
            if (subCommand === "update_time" && responseList.server.update_time) {
                if (words.length === 3 && words[2].includes("p:")) {
                    const portMatch = words[2].match(/p:(\d+)/);
                    const port = portMatch ? portMatch[1] : null;
                    if (port.toString().length === 6) {
                        if (words[2].includes("u:")) {
                            const updateMatch = words[2].match(/u:(\d+)/);
                            const updateTimeM = updateMatch ? updateMatch[1] : null;
                            if (updateTimeM > 10) {
                                updateTime = updateTimeM
                                await serverUpdate(updateTime, port, 'update')
                                newUpdateDetected = true
                                displayInHtmlConsole(createHTMLelement("Updated the update_time for the server", "purple"))
                                return;
                            } else {
                                displayInHtmlConsole(createHTMLelement("Update time must be bigger than 10 milliseconds", "purple"))
                                return;
                            }
                        }
                    } else {
                        displayInHtmlConsole(createHTMLelement("Update Time for a non-exsisting port cannot be updated", "red"))
                        return;
                    }
                }
            }
            if (subCommand === "requests_max" && responseList.server.requests_max) {
                if (words.length === 3 && words[2].includes("p:")) {
                    const portMatch = words[2].match(/p:(\d+)/);
                    const port = portMatch ? portMatch[1] : null;
                    if (port.toString().length === 6) {
                        if (words[2].includes("r:")) {
                            const requestIdMatch = words[2].match(/r:(\d+)/);
                            const requestCheck = requestIdMatch ? requestIdMatch[1] : null;
                            if (requestCheck > 0 && requestCheck < 1000) {
                                handleRequestPRV = requestCheck;
                                await serverUpdate(handleRequestPRV, port, 'requests')
                                newUpdateDetected = true
                                displayInHtmlConsole(createHTMLelement("Updated the request_max for the server", "purple"))
                                return;
                            } else {
                                displayInHtmlConsole(createHTMLelement("Requests per cannot be 0 or above 1000", "red"))
                                return;
                            }
                        }
                    } else {
                        displayInHtmlConsole(createHTMLelement("Requests for a non-exsisting port cannot be updated", "red"))
                        return;
                    }
                }
            }
            if (subCommand === "ash" && responseList.server.ash) {
                if (words.length === 3 && words[2].includes("p:")) {
                    const port = words[2].replace(/^p:/, "").trim();
                    const server = await firebase.database().ref("servers/server:" + port).once("value")
                    if (server.val() !== null && server.val() !== undefined) {
                        asnwerPropmt = false
                        const intervalId = await setInterval(() => {
                            if (answerDigit !== 0) {
                                clearInterval(intervalId);
                                console.log(answerDigit)
                            }
                        }, 100);
                        if (window.answerDigit === 1) {
                            prompresponse = true
                        } else
                        if (window.answerDigit === -1) {
                            prompresponse = false
                        } else {
                            prompresponse = false
                        }
                        if (prompresponse === true) {
                            displayInHtmlConsole(createHTMLelement("Deleting server, hold on", "yellow"))
                            firebase.database().ref("servers/server:" + port).remove()
                                .then(() => {
                                    displayInHtmlConsole(createHTMLelement("Server deleted succesfully!", "green"))
                                })
                                .catch((error) => {
                                    lastError = error
                                    displayInHtmlConsole(createHTMLelement("Error deleting server", "red"))
                                });

                        } else {
                            displayInHtmlConsole(createHTMLelement("Are you sure you want to delete this server?", "yellow"))
                            promptAnswer("server ash " + words[2])
                            console.log("server ash " + words[2])
                            return;
                        }
                    } else {
                        displayInHtmlConsole(createHTMLelement("Server not found", "red"))
                        return;
                    }
                }
            }
            if (subCommand === "restart" && responseList.server.restart) {
                newUpdateDetected = true
                return;
            }
            if (subCommand === "stop" && responseList.server.stop) {
                if (words.length === 3 && words[2].includes("all")) {
                    stopAllServers();
                    displayInHtmlConsole(createHTMLelement("Stopping all servers.", "yellow"))
                    return;
                }
                if (serverInfo.hasOwnProperty("port")) {
                    serverStop = true
                    displayInHtmlConsole(createHTMLelement("Stopping server", "purple"))
                    return;
                } else {
                    displayInHtmlConsole(createHTMLelement("No server is running", "purple"))
                    return;
                }
            }
        } if (commandName === "system") {
            if (subCommand === "last" && responseList.system.last) {
                if (words.length === 3 && words[2].includes("error")) {
                    if (lastError !== "" && lastError.length > 0) {
                        displayInHtmlConsole(createHTMLelement("errormesage: " + lastError, "red"))
                        return
                    } else {
                        displayInHtmlConsole(createHTMLelement("No error message on record", "#FF00FF"))
                        return
                    }
                }
            }
        }

        console.log(responseList.default); // Log the default response to the console
        displayInHtmlConsole(createHTMLelement("Invalid command", "red"))
    }
}

function promptAnswer(text) {
    asnwerPropmt = true
    displayInHtmlConsole(createHTMLelement(": Answer with 'yes' or 'ignore' if you wish to pursue or ignore the actions from the last prompt"))
    let elements = `<button onclick="returnAnswer(true)" style="color: red">Yes</button><button onclick="returnAnswer(false)" style="color: blue">Ignore</button>`
    consolehtml.innerHTML += elements;
    handleInput(text)
}

async function stopAllServers() {
    await firebase.database().ref("servers").once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const serverKey = childSnapshot.key;
                firebase.database().ref(`servers/${serverKey}/status`).set("offline");
            });
        })
        .catch((error) => {
            lastError = error
            displayInHtmlConsole(createHTMLelement("Error stopping all servers", "red"))
        });

}



function awaitSuccess(response) {
    return new Promise(function (resolve, reject) {
        let intervalId = setInterval(function () {
            if (response !== null) {
                console.log("Response received:", response);
                clearInterval(intervalId);
                resolve(response);
            }
        }, 100);

        setTimeout(function () {
            console.log("Interval cancelled.");
            clearInterval(intervalId);
            reject(new Error("Timeout exceeded"));
        }, 5000);
    });
}

function handleInputKeypress(event) {
    updateCommandList();
    if (event.keyCode === 13 && asnwerPropmt !== true) {
        handleInput();
    }
}


let consolehtml;

function createHTMLelement(text, color = null) {
    if (color === null) {
        return `<p>${text}</p>`
    } else {
        return `<p style="color: ${color}">${text}</p>`
    }
}

function displayInHtmlConsole(element) {
    consolehtml.innerHTML += element;
}

function checkServers() {
    firebase.database().ref('servers').once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null && snapshot.val() !== '') {
                displayInHtmlConsole(createHTMLelement("there is a server hosted", "purple"))
            } else {
                displayInHtmlConsole(createHTMLelement("no server is hosted", "blue"))
            }
        })
        .catch((error) => {
            lastError = error
            displayInHtmlConsole(createHTMLelement("error: fetching server", "red"))
        });
}

async function ping() {
    // Retrieve user data from the database
    firebase.database().ref('ping').once('value').then(function (snapshot) {
        const pong = snapshot.val();
        console.log(pong)
        if (pong === "pong") {
            return true;
        } else return false;
    });
}

async function createRequest(reqid) {
    const requestId = `req${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`;
    firebase.database().ref(`requests/${requestId}`).set({reqid})
        .then(() => {
            return true
        })
        .catch((error) => {
            lastError = error
            return false
        });
}


async function startServer(port, restart) {
    let server = await updateServerInfo(port)
    if (server === "") {
        displayInHtmlConsole(createHTMLelement("The server ran into a problem, please check that the server isn't broken or missing a port, or try again", "purple"))
        return
    }
    if (server === false) {
        displayInHtmlConsole(createHTMLelement("The server you are trying to connect to is broken, before preceeding, please check that server contains all neccessary information", "red"))
        return
    }
    serverInfo = server
    updateTime = server.updateTime
    handleRequestPRV = server.requestsPerCheck
    if (restart === false) {
        var cont = false;
        var str = "server:" + port;
        firebase.database().ref('servers/' + str).set({server})
            .then(() => {
                console.log(`Server ${port} added to database`);
                serverUpdate("running", port, 'status')

            })
            .catch((error) => {
                lastError = error
                console.error(`Failed to add server ${port} to database:`);
                displayInHtmlConsole(createHTMLelement("Server failed to start ", "red"))
                cont = false;
                return false
            });
    } else {
        displayInHtmlConsole(createHTMLelement("Server has restarted", "blue"))
    }
    let intervalId = setInterval(async function() {
        try {
            if (serverStop === true) {
                await serverUpdate("offline", port, 'status')
                serverStop = false
                clearInterval(intervalId);
                return
            }
            if (newUpdateDetected === true) {
                await serverUpdate("restarting", port, 'status')
                displayInHtmlConsole(createHTMLelement("Restaring server...", "purple"))
                clearInterval(intervalId);
            }

            const snapshot = await firebase.database().ref("requests").limitToFirst(parseInt(handleRequestPRV)).once("value");
            var checksRepeated = 0
            if (snapshot.exists()) { // Check if there are requests
                snapshot.forEach(function(childSnapshot) {
                    if (checksRepeated < handleRequestPRV) {
                        const request = childSnapshot.val();
                        const requestId = childSnapshot.key;
                        const reqId = request.reqid;
                        console.log(`Request received: requestId=${requestId}, reqId=${reqId}`);
                        var handledSuccesfully = false
                        if (reqId === "rq_ping") {
                            console.log("pong")
                            handledSuccesfully = true
                        }

                        // Handle the request here
                        // ...

                        // Remove the request from the database
                        if (handledSuccesfully === true) {
                            firebase.database().ref(`requests/${requestId}`).remove();
                        }
                        checksRepeated += 1
                    }
                });
            } else {
            }
        } catch (error) {
            lastError = error
            displayInHtmlConsole(createHTMLelement("Server encountered an error and crashed!", "red"))
            clearInterval(intervalId);
        }
    }, updateTime);

    if (newUpdateDetected === true) {
        newUpdateDetected = false
        setTimeout(() => {
            console.log(`Starting server on port ${port}`);
            startServer(port, true);
        }, 2000); // Wait for 2 seconds
    }
}

async function serverUpdate(status, port, node) {
    if (node === 'requests') {
        firebase.database().ref(`servers/server:${port}`).update({ 'server/requestsPerCheck': status })
    }if (node === 'status') {
        firebase.database().ref(`servers/server:${port}`).update({ 'server/status': status })
    }if (node === 'update') {
        firebase.database().ref(`servers/server:${port}`).update({ 'server/updateTime': status })
    }
}

async function updateServerInfo(port) {
    var server = {}
    const snapshot = await firebase.database().ref("server/server:" + port + "/server").once("value")
    let snapval = snapshot.val()
    try {
        console.log(snapshot.val())
        if (snapshot.val() === null) {
            server = {
                port: port,
                status: "waiting",
                updateTime: updateTime,
                requestsPerCheck: handleRequestPRV
            }
        }else
        if (snapshot.val() === undefined) {
            return ""
        }else {
            server = {
                port: port,
                status: snapval.status,
                updateTime: snapval.updateTime,
                requestsPerCheck: snapval.requestsPerCheck
            }
        }
    } catch (error) {
        lastError = error
        return false
    }
    return server
}

let commands = [
    {
        commands: {
            start: {
                server: [
                    "",
                    "p:"
                ]
            },
            check: [
                "server"
            ],
            ping: "",
            server: {
                status: [
                    "",
                    "this.server"
                ],
                create: {
                    request: [
                        "ping"
                    ]
                },
                connect: [
                    "",
                    "p:"
                ],
                update_time: [
                    "p:u:"
                ],
                requests_max: [
                    "p:r:"
                ],
                ash: [
                    "p:"
                ],
                restart: "",
                stop: ""
            },
            system: {
                last: [
                    "error"
                ]
            }
        },
        response: {
            default: "Invalid command",
            start: {
                server: {
                    "": "startserver, default",
                    "p:": "startserver, p"
                }
            },
            check: {
                server: "checkingserver, default"
            },
            ping: "pingserver, default",
            server: {
                status: {
                    "": "serverstatus, default",
                    "this.server": "serverstatus, current"
                },
                create: {
                    request: {
                        "ping": "sendrequest, ping"
                    }
                },
                connect: {
                    "": "connectfirstserver, default",
                    "p:": "connectserverwithip, p"
                },
                update_time: {
                    "p:u:": "update_update_time, default"
                },
                requests_max: {
                    "p:r:": "update_requests_max, default"
                },
                ash: {
                    "p:": "deleteserver, port"
                },
                restart: "restartserver, default",
                stop: "stopserver, default"
            },
            system: {
                last: {
                    "error": "retrieve_errormessage, default"
                }
            }
        }
    }
]