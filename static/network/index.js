// Start with first post
let counter = 0;

// Load posts 20 at a time
const quantity = 10;

// Start with first post
let counterP = 0;

// Load posts 20 at a time
const quantityP = 10;

isLoading = false;

let contenGlobe = {}

// When DOM loads, render the first 20 posts
document.addEventListener('DOMContentLoaded', () => {
    let following = document.getElementById("following");

    // Add an event listener to the anchor element
    following.addEventListener('click', (event) => {
        event.preventDefault();
        profile(event);
    });

    load();
});

// If scrolled to bottom, load the next 20 posts
window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight)  {
        if(!isLoading)
        {
            load();
        }
        else{
            // const urlParams = new URLSearchParams(window.location.search);
            // const user = urlParams.get('user');
            profile(event,contentGlobe);
        }
    }
};

// Load next set of posts
function load() {

    // Set start and end post numbers, and update counter
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;


    post = document.getElementById('post-btn');

    post = document.getElementById("poster-h2")
    post.innerHTML = `All posts`;

  


    // Get new posts and add posts
    fetch(`/posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
          // Check if data.posts is an array
          if (data.posts && Array.isArray(data.posts.posts)) {
            // If it's an array, iterate over each post
            data.posts.posts.forEach(post => {
                add_post(post);
            });
        } else {
            // If it's not an array, handle it accordingly (e.g., log an error)
            console.error("Data.posts is not an array:", data.posts);
        }

    })




    
};

// Add a new post with given contents to DOM
function add_post(contents, isTop=false) {


    // Create new post
    const post = document.createElement('div');
    post.className = "post";
    
    let poster = document.createElement('h4');
    poster.innerHTML = `@${contents.poster}`;
    poster.className = "poster";
    poster.id = `${contents.poster}_poster`;

    poster.addEventListener("mouseover", function() {
        poster.style.cursor = "pointer";
    });

    poster.onclick = function(event){
        event.preventDefault();
        // window.location.href = `/profile/${contents.poster}`;
        profile(event, contents.poster);
    }

   
    let container = document.createElement('div');
    containerID =  `${contents.id}_container`;
    container.setAttribute('id',containerID);
    let posted = document.createElement('h5');
    posted.innerHTML = contents.post;
    posted.setAttribute=('id', `${contents.id}_content`);
    container.appendChild(posted);

   
    
    if(contents.edited){
        let edited = document.createElement('a');
        edited.innerHTML = 'Edited';
    }

    let date = document.createElement('p');
    date.innerHTML = contents.date;
    

    

        // Create SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "25px");
    svg.setAttribute("height", "25px");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.classList.add("svg-container");
    svg.setAttribute("class", "svg-fill");

    // Create path element for the fire emoji
    var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("opacity", "0.5");
    path1.setAttribute("d", "M12.8324 21.8013C15.9583 21.1747 20 18.926 20 13.1112C20 7.8196 16.1267 4.29593 13.3415 2.67685C12.7235 2.31757 12 2.79006 12 3.50492V5.3334C12 6.77526 11.3938 9.40711 9.70932 10.5018C8.84932 11.0607 7.92052 10.2242 7.816 9.20388L7.73017 8.36604C7.6304 7.39203 6.63841 6.80075 5.85996 7.3946C4.46147 8.46144 3 10.3296 3 13.1112C3 20.2223 8.28889 22.0001 10.9333 22.0001C11.0871 22.0001 11.2488 21.9955 11.4171 21.9858C11.863 21.9296 11.4171 22.085 12.8324 21.8013Z");
    path1.setAttribute('fill', "#0c2c67");
    path1.id = `${contents.id}_fill1`;
    path1.setAttribute("class", "path1");

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M8 18.4442C8 21.064 10.1113 21.8742 11.4171 21.9858C11.863 21.9296 11.4171 22.085 12.8324 21.8013C13.871 21.4343 15 20.4922 15 18.4442C15 17.1465 14.1814 16.3459 13.5401 15.9711C13.3439 15.8564 13.1161 16.0008 13.0985 16.2273C13.0429 16.9454 12.3534 17.5174 11.8836 16.9714C11.4685 16.4889 11.2941 15.784 11.2941 15.3331V14.7439C11.2941 14.3887 10.9365 14.1533 10.631 14.3346C9.49507 15.0085 8 16.3949 8 18.4442Z");
    path2.setAttribute('fill', "#0c2c67");
    path2.id = `${contents.id}_fill2`;
    path2.setAttribute("class", "path2");


    // Append path elements to SVG element
    svg.appendChild(path1);
    svg.appendChild(path2);

    svg.onclick = function() {
        id = contents.id;
        liked(event, id);
    };

    if(contents.liked){
        path1.setAttribute('fill', "#2c29e2" )
        path2.setAttribute('fill', "#00BFFF" )
    }

    let like = document.createElement('p');
    like.innerHTML = contents.likes;
    likeId = `${contents.id}_like`;
    like.setAttribute("id", likeId );

    
    post.appendChild(poster);

    if (contents.viewer === contents.poster_id) {
        let edit = document.createElement('a');
        edit.innerHTML = 'Edit';
        edit.setAttribute("id", `${contents.id}_edit`);        
        edit.setAttribute("class", "text-primary");
        edit.addEventListener("mouseover", function() {
            edit.style.cursor = "pointer";
        });
            post.appendChild(edit);
    
        // Attach onclick event handler
        edit.onclick = function() {
            let id = contents.id;
            // let content = contents.post; // Corrected assignment
            Edit(event, id, contents);
        };
    }
   
    
    post.appendChild(container);

    if(contents.edited){
        let edited = document.createElement('a');
        edited.innerHTML = 'Edited';
        post.appendChild(edited)
    }
    let likeContainer = document.createElement('div');
    likeContainer.setAttribute('class', 'like-div');
    likeContainer.appendChild(svg);
    likeContainer.appendChild(like);
    let containerInfo = document.createElement('div');
    containerInfo.setAttribute('class', 'container-info');
    containerInfo.appendChild(likeContainer);
    containerInfo.appendChild(date);
    post.appendChild(containerInfo);
   
    
    if(!isTop){
        // Add post to DOM
        document.querySelector('#posts').append(post);
    }
    else{
        document.querySelector('#posts').prepend(post);
    }
};

function Edit(event, id, content){
    let contain = `${id}_container`;
    
    try{
        let container = document.getElementById(contain);
        console.log(container);
        container.innerHTML = " ";
        // alert(container)
        let edited_content = document.createElement('textarea');
        edited_content.setAttribute("class", "form-control");
        edited_content.setAttribute("id", `${id}_content`);
        let edit_button = document.createElement('button');
        edit_button.setAttribute("id", `${id}_edit`);
        edit_button.setAttribute("class", "btn btn-primary");
        edited_content.value = content.post;

        edit_button.innerHTML = "Edit";
        container.appendChild(edited_content);
        container.appendChild(edit_button);
        edit_button.addEventListener("mouseover", function() {
            edit_button.style.cursor = "pointer";
        });
        edit_button.disabled = true;
        edited_content.onkeyup = function(event){

        edit_button.disabled = false;
        
        edit_button.onclick = function(e) {
            post_content = event.target.value
            fetch('edit',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') 
                },
                body: JSON.stringify({
                    'id': id,
                    'content': post_content
                })
            }).then(response => {
                // Check if the update was successful
                if (response.ok) {
                    container.innerHTML = " ";
                    contentID = `${content.id}_content`
                    
                    let edited_content = document.createElement('h3');
                    edited_content.innerHTML = post_content;
                    container.appendChild(edited_content);


                } else {
                    console.error('Error updating content:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
            edit_button.addEventListener("mouseover", function() {
                edit_button.style.cursor = "pointer";
            });
        }


        }
        catch (error ) {
            console.error('Error:', error);
        }


        
    


}

function liked(event, id) {
    // Prevent default behavior of the event
    let pathId1 = `${id}_fill1`;
    let pathID2 = `${id}_fill2`;
     let path1 = document.getElementById(pathId1);
     let path2 = document.getElementById(pathID2);
    event.preventDefault();

    fetch('like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'id': id
        })
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        // Now you can access the data returned from the server
        if (data && data.likes !== undefined) {
            // Request was successful
            console.log(data);
            if (path1) {
                console.log(path1);
                if (data.isLiked){
                    path1.setAttribute("fill", "#2c29e2");
                    path2.setAttribute("fill", "#00BFFF");
                }
                else{
                    path1.setAttribute('fill', "#1E1E1E"); 
                    path2.setAttribute('fill', "#0c2c67");
                }
                
            } else {
                console.error('Path element not found:', pathId);
            }
            likeId = `${id}_like`

            let L = document.getElementById(likeId);
            if (L) {
                let likes = data.likes;
                L.innerHTML = likes;
            } else {
                console.error('Element not found:', id);
            }

            console.log('Request successful');
        } else {
            // Request failed or response is unexpected
            console.error('Request failed or response is unexpected');
        }
        // load();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// function deletePost(event, id) {
//     event.preventDefault();
// }

function submitPost(event){
    event.preventDefault();
    const form = document.getElementById("post-form");

    const formData = new FormData(form);
    const post = formData.get("post");

    fetch('post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'post': post
        })

    }).then(response => response.json())
    .then(data => {
        if (data && data.data.post!== undefined) {
            // Request was successful
            console.log('Request successful');
            add_post(data.data, true);
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


function profile(event, content){
    const startP = counterP;
    const endP = startP + quantityP - 1;
    counterP = endP + 1;
    
    contentGlobe = content || "null";
    console.log(`${contentGlobe} contentG and ${content}`);
    
    fetch(`/profile?startP=${startP}&endP=${endP}&user=${contentGlobe}`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        // Check if data.posts is an array
        if (Array.isArray(data.posts.posts)) {
            // If it's an array, iterate over each post
            if(!isLoading){
                previous = document.getElementById("posts");
                previous.innerHTML = ""; 
                window.scrollTo(0, 0);
            }
            isLoading = true;
            for (let post of data.posts.posts){
                // Pass each post object to profileStats and add_post functions
                // console.log(post);
                console.log(data.posts)
                profileStats(data.posts);
                console.log(data.posts)
                add_post(post);
            }
        } else {
            // If it's not an array, handle it accordingly (e.g., log an error)
            console.error("Data.posts is not an array:", data.posts);
        }

    })
}

function profileStats(data) {

    if (contentGlobe === undefined) {
        contenGlobe = data.userProfile;
    }
    index = document.getElementById("index-div");
    index.innerHTML = "";

 
    post = document.getElementById("poster-h2")
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

 function follow(event, data) {
    let pathId = `${data.userProfile}_follow`;
    let followID = `${data.currentUser}_followers`;
    let path = document.getElementById(pathId);
    let follow = document.getElementById(followID);
    event.preventDefault();

    fetch('/follow', { // Ensure the correct URL is used
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'user': data.userProfile
        })
    })
    .then(response => response.json()) // Parse JSON response
    .then(B_data => {
        // Now you can access the data returned from the server
        if (B_data && B_data.isFollow !== undefined) {
            // Request was successful
            console.log(B_data);
            if (path) {
                console.log(path);
                if (B_data.isFollow) {
                    path.innerHTML = "- following";
                    // Update the follow count only if it exists
                    follow = document.getElementById(`${B_data.user}_followers`);
                    follow.innerHTML = `${B_data.following}`;
                } else {
                    path.innerHTML = "- follow";
                    follow = document.getElementById(`${B_data.user}_followers`);
                    //alert(`${follow} ${B_data.following}`);
                    follow.innerHTML = `${B_data.following}`; 
                }
            } else {
                console.error('Path element not found:', pathId);
            }
            console.log('Request successful');
        } else {
            // Request failed or response is unexpected
            console.error('Request failed or response is unexpected');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

 


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if the cookie name matches the provided name
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}