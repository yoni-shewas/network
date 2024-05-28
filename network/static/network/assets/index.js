// Start with first post
let counter = 0;

import { add_post }  from  './scripts/addPost';
import { getCookie } from './scripts/cookies/getCookie.js';


// Load posts 20 at a time
const quantity = 10;


// Start with first post
let counterP = 0; 
let counterComment= 0; 

// Load posts 20 at a time
const quantityP = 10;

let isLoading = false;


let contentGlobe = "null";



// When DOM loads, render the first 20 posts
document.addEventListener('DOMContentLoaded', () => {
    let following = document.getElementById("following");

    let post = document.getElementById("post");
    let postButton = document.getElementById("postButton");

    postButton.disabled = true;
    post.onkeyup = () => {
        if (post.value.length > 0) {
            postButton.disabled = false;
        } else {
            postButton.disabled = true;
        }

        postButton.onclick = (event) => {
            postButton.disabled = true;
            submitPost(event);
        };
    };


    const followingClickHandler = (event) => {
        event.preventDefault();
        contentGlobe = "null";
        profile(event, "null", true);
        
        following.addEventListener('click', followingClickHandler);
    };

    // Add an event listener to the "following" anchor element
    following.addEventListener('click', followingClickHandler);

    load();

    const reattachFollowingListener = () => {
        // Remove the previous event listener
        following.removeEventListener('click', followingClickHandler);
        // Add the event listener again
        following.addEventListener('click', followingClickHandler);
    }


    
    // Call the reattachFollowingListener function after calling profile
    window.addEventListener('popstate', reattachFollowingListener);

});

// If scrolled to bottom, load the next 20 posts
// Define debounce function
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Wrap your scroll event handler with debounce
window.onscroll = debounce(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (!isLoading) {
            load();
        } else {
            profile(event, contentGlobe);
        }
    }
}, 300);
// Load next set of posts
function load() {

    // Set start and end post numbers, and update counter
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;



    let post = document.getElementById("poster-h2")
    post.innerHTML = "All posts";
  


     // Get the textarea element
     var textarea = document.getElementById("post");

     // Add event listener for input events
     textarea.addEventListener("input", function() {
       // Get the current word count
       var wordCount = this.value.length;
 
       // Update the word count display
       document.getElementById("wordCount").textContent = wordCount + " / 200 Characters";
 
       let button = document.getElementById("postButton");
       // If word count exceeds 200, truncate the text
       if (wordCount > 200) {
         document.getElementById("wordCount").textContent = "200 / 200 Characters please minimize the post";
         button.disabled = true;
       }
       else{
        button.disabled = false;
       }
     });

  


    // Get new posts and add posts
    fetch(`/posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
          // Check if data.posts is an array
          if (data.posts && Array.isArray(data.posts.posts)) {
            // If it's an array, iterate over each post
            data.posts.posts.forEach(post => {
                add_post(post,document,counterComment);
            });
        } else {
            // If it's not an array, handle it accordingly (e.g., log an error)
            console.error("Data.posts is not an array:", data.posts);
        }

    })




    
};



export function profile(event, content, isFollowClick) {
    const startP = counterP;
    const endP = startP + quantityP - 1;
    counterP = endP + 1;
    
    if (isFollowClick) {

        contentGlobe = "null";
        isFollowClick = false;
    }
    else{
        contentGlobe = content || "null";
    }
    // console.log(`${contentGlobe} contentG and ${content}`);
    
    fetch(`/profile?startP=${startP}&endP=${endP}&user=${contentGlobe}`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        // Check if data.posts is an array
        if (Array.isArray(data.posts.posts)) {
            // If it's an array, iterate over each post
            if(!isLoading){
                let previous = document.getElementById("posts");
                previous.innerHTML = ""; 
                window.scrollTo(0, 0);
            }
            isLoading = true;
            // console.log(`${(data.posts)} posts ${data.posts.posts} post`);
            data.posts.posts.forEach(post => {
                // Pass each post object to profileStats and add_post functions
                // console.log(post);
                // console.log(data.posts)
                profileStats(data.posts);
                // console.log(data.posts)
                add_post(post, document, counterComment);
            });
        } else {
            // If it's not an array, handle it accordingly (e.g., log an error)
            console.error("Data.posts is not an array:", data.posts);
        }

    })
}

function profileStats(data) {
    if (contentGlobe === "null") {
        contentGlobe = data.userProfile;
    }
    let index = document.getElementById("index-div");
    
    index.innerHTML = "";

    let post = document.getElementById("poster-h2");
    if (data.is_following) {
        post.innerHTML = `For you posts`;
    } else {
        post.innerHTML = `${data.userProfile} posts`;
    }

    let user = document.createElement("h1");
    user.innerHTML = `${data.userProfile}`;

    let divUser = document.createElement("div");
    divUser.id = "user-follow";
    divUser.appendChild(user);

    if (data.user !== data.userProfile) {
        let followA = document.createElement('a');

         
        if (data.isfollowing) {
            followA.innerHTML = ' - following';
        } else {
            followA.innerHTML = ' - follow';
        }

        followA.setAttribute("id", `${data.userProfile}_follow`);
        followA.setAttribute("class", "text-primary");
        followA.addEventListener("mouseover", function() {
            followA.style.cursor = "pointer";
        });
        divUser.appendChild(followA);

        // Chat button
        const chatIconSvg = `
        chat...<svg width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1a36d6" transform="rotate(0)">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#1a36d6CCCCCC" stroke-width="0.024"> <!-- Adjusted stroke width -->
            </g>
            <g id="SVGRepo_iconCarrier">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#1a36d6" stroke-width="2.4">
                </path>
            </g>
        </svg>
    `;

           const chatButton = document.createElement('div');
           chatButton.innerHTML = chatIconSvg;
           // chatButton.setAttribute("class", "btn btn-primary ml-2");
           chatButton.onclick = function() {
               openChatWindow(data.userProfile);
           };
           divUser.appendChild(chatButton);


        // Attach onclick event handler
        followA.onclick = function(event) {
            follow(event, data);
        };

       
    }

    let divF = document.createElement("div");
    divF.className = "follow-stat";
    let labelF = document.createElement("p");
    labelF.innerHTML = "Followers";
    let followers = document.createElement("p");
    followers.innerHTML = `${data.followers}`;
    followers.id = `${data.userProfile}_followers`;
    divF.appendChild(labelF);
    divF.appendChild(followers);

    let divf = document.createElement("div");
    divf.className = "follow-stat";
    let labelf = document.createElement("p");
    labelf.innerHTML = "Following";
    let following = document.createElement("p");
    following.innerHTML = `${data.following}`;
    following.id = `${data.userProfile}_following`;
    divf.appendChild(labelf);
    divf.appendChild(following);

    index.appendChild(divUser);
    index.appendChild(divF);
    index.appendChild(divf);
}

// Function to open chat window
function openChatWindow(username) {
    // Create chat window elements
    let chatWindow = document.createElement('div');
    chatWindow.setAttribute("id", "chat-window");

    let chatHeader = document.createElement('div');
    chatHeader.setAttribute("class", "chat-header");
    chatHeader.innerHTML = `<h4>Chat with ${username}</h4>`;

    let chatContent = document.createElement('div');
    chatContent.setAttribute("class", "chat-content");
    chatContent.setAttribute("id", "chat-content");

    let chatInput = document.createElement('input');
    chatInput.setAttribute("type", "text");
    chatInput.setAttribute("id", "chat-input");
    chatInput.setAttribute("placeholder", "Type your message here...");

    let sendButton = document.createElement('button');
    sendButton.setAttribute("id", "send-button");
    sendButton.innerHTML = "Send";
    sendButton.onclick = function() {
        sendMessage(username);
    };

    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(chatContent);
    chatWindow.appendChild(chatInput);
    chatWindow.appendChild(sendButton);
    
    let index = document.getElementById("index-div");
    
    index.innerHTML = "";

    let post = document.getElementById("poster-h2");
    
    post.innerHTML = `chat with ${username}`;


    index.appendChild(chatWindow);

    // Load recent chats
    loadChats(username);
}

// Function to load chats
function loadChats(username) {
    let start = 0;
    let end = 9;
    fetch(`/chat?receiver=${username}&start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            let chatContent = document.getElementById("chat-content");
            chatContent.innerHTML = ""; 

            data.chats.forEach(chat => {
                let chatMessage = document.createElement("div");
                chatMessage.className = "chat-message";

                let chatText = document.createElement("div");
                chatText.className = "chat-text";
                chatText.innerHTML = chat.chat;

                let chatDate = document.createElement("div");
                chatDate.className = "chat-date small text-muted"; 
                chatDate.innerHTML = new Date(chat.date).toLocaleTimeString(); 

                if (chat.sender === username) {
                    chatMessage.classList.add("sent");
                    chatText.style.color = "#0069d9"; // Change color for sent messages
                } else {
                    chatMessage.classList.add("received");
                    chatText.style.color = "#28a745"; // Change color for received messages
                }

                chatMessage.appendChild(chatText);
                chatMessage.appendChild(chatDate);
                chatContent.appendChild(chatMessage);
            });

            // Add a load more button
            if (data.chats.length > 0) {
                let loadMoreButton = document.createElement("button");
                loadMoreButton.setAttribute("id", "load-more-button");
                loadMoreButton.className = "btn btn-primary mt-3"; 
                loadMoreButton.innerHTML = "Load More";
                loadMoreButton.onclick = function() {
                    loadMoreChats(username, start, end);
                };
                chatContent.appendChild(loadMoreButton);
            }
        })
        .catch(error => console.error("Error loading chats:", error));
}

// Function to load more chats
function loadMoreChats(username, start, end) {
    start += 10;
    end += 10;
    fetch(`/chat?receiver=${username}&start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            let chatContent = document.getElementById("chat-content");

            data.chats.forEach(chat => {
                let chatMessage = document.createElement("div");
                chatMessage.className = "chat-message";

                let chatText = document.createElement("div");
                chatText.className = "chat-text";
                chatText.innerHTML = chat.chat;

                let chatDate = document.createElement("div");
                chatDate.className = "chat-date small text-muted"; 
                chatDate.innerHTML = chat.date; 

                if (chat.sender === username) {
                    chatMessage.classList.add("sent");
                    chatText.style.color = "#0069d9"; // Change color for sent messages
                } else {
                    chatMessage.classList.add("received");
                    chatText.style.color = "#28a745"; // Change color for received messages
                }

                chatMessage.appendChild(chatText);
                chatMessage.appendChild(chatDate);
                chatContent.appendChild(chatMessage);
            });
        })
        .catch(error => console.error("Error loading more chats:", error));
}

// Function to send a message
function sendMessage(receiverUsername) {
    let message = document.getElementById("chat-input").value;
    if (message.trim() === "") {
        alert("Message cannot be empty");
        return;
    }

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken', document)
        },
        body: JSON.stringify({
            message: message,
            receiver: receiverUsername
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            let chatContent = document.getElementById("chat-content");
            let chatMessage = document.createElement("div");
            chatMessage.className = "chat-message sent";

            let chatText = document.createElement("div");
            chatText.className = "chat-text";
            chatText.style.color = "#0069d9"; // Change color for sent messages
            chatText.innerHTML = message;

            let chatDate = document.createElement("div");
            chatDate.className = "chat-date small text-muted"; 
            chatDate.innerHTML = new Date().toLocaleTimeString(); 

            chatMessage.appendChild(chatText);
            chatMessage.appendChild(chatDate);
            chatContent.appendChild(chatMessage);

            document.getElementById("chat-input").value = ""; 
        }
    })
    .catch(error => console.error("Error sending message:", error));
}


   


 
function submitPost(event){
     event.preventDefault();
     const postButton = document.getElementById("postButton");
     postButton.disabled = true;
     const form = document.getElementById("post-form");
 
     const formData = new FormData(form);
     const post = formData.get("post");
 
     fetch('post', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'X-CSRFToken': getCookie('csrftoken',document) // Function to retrieve CSRF token from cookie
         },
         body: JSON.stringify({
             'post': post
         })
 
     }).then(response => response.json())
     .then(data => {
         if (data && data.data.post!== undefined) {
             // Request was successful
             console.log('Request successful');
             add_post(data.data, document,counterComment, true);
             postButton.disabled = false;
         } else {
             // Request failed or response is unexpected
            //  console.log(data.post);
             console.error('Request failed or response is unexpected');
         }
     })
     .catch(error => {
         console.error('Error:', error);
     });
 }
 











 


