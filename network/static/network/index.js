// Start with first post
let counter = 0;

// Load posts 20 at a time
const quantity = 20;

// When DOM loads, render the first 20 posts
document.addEventListener('DOMContentLoaded', load);

// If scrolled to bottom, load the next 20 posts
window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
};

// Load next set of posts
function load() {

    // Set start and end post numbers, and update counter
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;
    fetch('')

    post = document.getElementById('post-btn');


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
function add_post(contents) {

    console.log(contents);

    // Create new post
    const post = document.createElement('div');
    post.className = "post";

    console.log(contents);
    
    let poster = document.createElement('h4');
    poster.innerHTML = contents.poster;
   

    let container = document.createElement('div');
    containerID =  `${contents.id}_container`;
    container.setAttribute('id',containerID);
    let posted = document.createElement('h3');
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
    svg.setAttribute("width", "20px");
    svg.setAttribute("height", "20px");
    svg.setAttribute("viewBox", "0 -3.71 75.17 75.17");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.classList.add("svg-container");

    // Create path element
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", "Path_1");
    path.setAttribute("data-name", "Path 1");
    path.setAttribute("d", "M117.606,280.375s22.263-15.459,31.959-30.318c9.6-14.708.354-31.054-10.533-33.8-14.457-3.65-21.426,10.478-21.426,10.478s-6.968-14.128-21.425-10.478c-10.888,2.748-20.132,19.094-10.534,33.8C95.343,264.916,117.606,280.375,117.606,280.375Z");
    path.setAttribute("transform", "translate(-80.021 -214.131)");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#0c2c67");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "3");
    path.id = `${contents.id}_fill`;

    svg.appendChild(path);

    svg.onclick = function() {
        id = contents.id;
        liked(event, id);
    };

    if(contents.liked){
        path.setAttribute('fill', "#0c2c67" )
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
    post.appendChild(date);
    post.appendChild(svg);
    post.appendChild(like);
    

    // Add post to DOM
    document.querySelector('#posts').append(post);

    // alert(document.getElementById(containerID), "contents");
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
            
            fetch('edit',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') 
                },
                body: JSON.stringify({
                    'id': id,
                    'content': event.target.value
                })
            }).then(response => {
                // Check if the update was successful
                if (response.ok) {
                    container.innerHTML = " ";
                    contentID = `${content.id}_content`
                    
                    let edited_content = document.createElement('h3');
                    edited_content.innerHTML = content.post;
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
    let pathId = `${id}_fill`;
            let path = document.getElementById(pathId);
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
            
            if (path) {
                console.log(path);
                if (data.isLiked){
                    path.setAttribute("fill", "#0c2c67");
                }
                else{
                    path.setAttribute("fill", "none");
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