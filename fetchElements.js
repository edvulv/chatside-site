/*function createContactElement(name, email) {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", "https://via.placeholder.com/50");
    img.setAttribute("alt", "Profile Picture");
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const p = document.createElement("p");
    p.textContent = email;

    div.appendChild(h2);
    div.appendChild(p);
    article.appendChild(img);
    article.appendChild(div);

    const contactList = document.querySelector(".contact-list");
    contactList.appendChild(article);
}*/
async function createContactElements(contacts) {
    console.log("CREATE CONTACTAS")
    const contactListElement = document.querySelector('.contact-list');
    contactListElement.innerHTML = '';

    for (const contact of contacts) {
        const element = document.createElement('article');
        element.onclick = async function () {
            loadChat(contact.chatid, contact.name, contact.id);
            chatwithuserid = contact.id;
            document.querySelector("#message-container").innerHTML = `<div class="loader color_white"></div>`;
            resetVar();
            selectedContact();
        };

        if (contact.name !== "Chatroom") {
            element.setAttribute('data-key', contact.id);
        }

        element.classList.add('chat-message');
        element.innerHTML = `<img src="userpic.png" alt="Profile Picture">
        <div>            
            <h2> 
            <span class="notification">0</span>${contact.name}</h2>
            <p>${contact.email}</p>
        </div>`;

        try {
            const snapshot = await firebase.database().ref("chats/" + contact.chatid + "/messages").once('value');
            const chatMessages = Object.values(snapshot.val());
            chatMessages.sort((a, b) => {
                const aNumber = parseInt(a.key.slice(1));
                const bNumber = parseInt(b.key.slice(1));
                return aNumber - bNumber;
            });

            console.log(chatMessages)

            let notificationCount = 0;
            let foundUserMessage = false;

            for (let i = chatMessages.length - 1; i >= 0; i--) {
                const message = chatMessages[i];
                if (message.sender === contact.id) {
                    foundUserMessage = true;
                    break;
                }
                notificationCount++;
            }

            if (notificationCount < 1) {
                element.querySelector(".notification").classList.add("none");
            } else {
                element.querySelector(".notification").innerHTML = notificationCount.toString();
            }

        } catch (error) {
            console.error(error);
        }

        contactListElement.appendChild(element);
    }
}


function selectedContact() {
    document.querySelector(".contact-list").querySelectorAll(".chat-message").forEach((contactelement) => {
        if (contactelement.getAttribute("data-key") === chatwithuserid) {
            contactelement.classList.add("selected")
            console.log("yues")
        } else {
            contactelement.classList.remove("selected")
            console.log("pardoOn")
        }
    })
}

function resetVar() {
    largestMessageNumber = 0
    console.log("RESETVAR")
}

function createMessageBubble(text, sender, isCurrentUser) {
    if (allowUpdate) {
        const div = document.createElement("div");
        div.classList.add(isCurrentUser ? "message-right" : "message-left");
        const p = document.createElement("p");
        p.textContent = text;

        if (!isCurrentUser) {
            const span = document.createElement("span");
            span.textContent = sender;
            div.appendChild(span);
        }

        div.appendChild(p);

        const messageContainer = document.querySelector("#message-container");
        messageContainer.appendChild(div);
    }
}

function loadChat(chatid, name, id) {
    window.hideWindows()
    window.chatwithuserid = id
    allowUpdate = true
    console.log("Loaded chat NOW")
    console.log(chatid + "  con: " + name + " " + id)
    let messageContainer = document.querySelector("#message-container");
    messageContainer.innerHTML = '';
    chatroomid = chatid;
    let chats = [];
    document.getElementById("username-chat").innerHTML = name
    firebase.database().ref(`chats/${chatid}/messages`).on('value', (snapshot) => {
        snapshot.forEach((messageSnapshot) => {
            const message = messageSnapshot.val();
            message.key = messageSnapshot.key; // Add the message key to the message object
            chats.push(message); // Add messages to the chats list
        });

        // Sort chats based on the m numbers
        chats.sort((a, b) => {
            const messageNumberA = parseInt(a.key.replace(/\D/g, ''));
            const messageNumberB = parseInt(b.key.replace(/\D/g, ''));
            return messageNumberA - messageNumberB;
        });

        // Clear message container and add sorted messages
        chats.forEach((message) => {
            const { sender, text } = message;
            const isCurrentUser = sender === userInfo.id;
            const messageBubble = createMessageBubble(text, name, isCurrentUser);
            messageContainer += messageBubble
        });
    });
    allowUpdate = false
    document.getElementById('message-container').classList.remove('hidden');
    document.getElementById('message-input-container').classList.remove('hidden');
}
function loadChatSmall(chatid, name, id) {
    window.hideWindows()
    window.chatwithuserid = id
    allowUpdate = true
    console.log(chatid + "  con: " + name + " " + id)
    let messageContainer = document.querySelector("#message-container");
    let messages = messageContainer.querySelectorAll(".message-left, .message-right")
    //messageContainer.innerHTML = '';
    chatroomid = chatid;
    let chats = [];
    document.getElementById("username-chat").innerHTML = name
    firebase.database().ref(`chats/${chatid}/messages`).on('value', (snapshot) => {
        snapshot.forEach((messageSnapshot) => {
            const message = messageSnapshot.val();
            message.key = messageSnapshot.key; // Add the message key to the message object
            chats.push(message); // Add messages to the chats list
        });

        // Sort chats based on the m numbers
        chats.sort((a, b) => {
            const messageNumberA = parseInt(a.key.replace(/\D/g, ''));
            const messageNumberB = parseInt(b.key.replace(/\D/g, ''));
            return messageNumberA - messageNumberB;
        });

        // Clear message container and add sorted messages
        chats.forEach((message) => {
            const { sender, text } = message;
            const isCurrentUser = sender === userInfo.id;
            const messageBubble = createMessageBubble(text, name, isCurrentUser);
            messageContainer += messageBubble
        });
    });
    allowUpdate = false
    document.getElementById('message-container').classList.remove('hidden');
    document.getElementById('message-input-container').classList.remove('hidden');
}
