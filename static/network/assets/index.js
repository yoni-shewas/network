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
        profile(event,"null",true);
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
    console.log(`${contentGlobe} contentG and ${content}`);
    
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
                console.log(data.posts)
                profileStats(data.posts);
                console.log(data.posts)
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

 
    let post = document.getElementById("poster-h2")
    if (data.is_following){
        post.innerHTML = `For you posts`;
    }
    else{
        post.innerHTML = `${data.userProfile} posts`;
    }
    
 
    let user = document.createElement("h1")
    user.innerHTML = `${data.userProfile}`;
    // alert(data);

    let divUser = document.createElement("div")
    divUser.id =  "user-follow"
    divUser.appendChild(user);

    if (data.user !== data.userProfile){

        let followA = document.createElement('a');
       
        if (data.isfollowing){     
            followA.innerHTML = ' - following';
        }   
        else{
            followA.innerHTML = ' - follow'; 
        }
        
        followA.setAttribute("id", `${data.userProfile}_follow`);        
        followA.setAttribute("class", "text-primary");
        followA.addEventListener("mouseover", function() {
            followA.style.cursor = "pointer";
        });
            divUser.appendChild(followA);

        // Attach onclick event handler
        followA.onclick = function(event) {
                // let content = contents.post; // Corrected assignment
            follow(event, data);
        };
}
 
    let divF = document.createElement("div")
    divF.className =  "follow-stat"
    let labelF = document.createElement("p")
    labelF.innerHTML = "Followers"
    let followers = document.createElement("p")
    followers.innerHTML = `${data.followers}`
    followers.id = `${data.userProfile}_followers`
    divF.appendChild(labelF)
    divF.appendChild(followers)
 
    let divf = document.createElement("div")
    divf.className =  "follow-stat"
    let labelf = document.createElement("p")
    labelf.innerHTML = "Following"
    let following = document.createElement("p")
    following.innerHTML = `${data.following}`
    following.id = `${data.userProfile}_following`
    divf.appendChild(labelf)
    divf.appendChild(following)
 
    index.appendChild(divUser)
    index.appendChild(divF)
    index.appendChild(divf)
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
             console.log(data.post);
             console.error('Request failed or response is unexpected');
         }
     })
     .catch(error => {
         console.error('Error:', error);
     });
 }
 











 


