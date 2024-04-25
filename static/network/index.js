// Start with first post
let counter = 0;

// Load posts 20 at a time
const quantity = 10;
const quantityComment = 5;

// Start with first post
let counterP = 0; 
let counterComment= 0; 

// Load posts 20 at a time
const quantityP = 10;

isLoading = false;

const paginationState = {};

let contentGlobe = "null";

// When DOM loads, render the first 20 posts
document.addEventListener('DOMContentLoaded', () => {
    let following = document.getElementById("following");


    const followingClickHandler = (event) => {
        event.preventDefault();
        profile(event,"null",true);
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
    post.id = `${contents.id}_post`;

    
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
        profile(event, contents.poster, false);
    }

   
    let container = document.createElement('div');
    containerID =  `${contents.id}_container`;
    container.className = "PostContainer text-wrap text-break"
    container.innerHTML = contents.post;

    container.setAttribute('id',containerID);
    // let posted = document.createElement('h5');
    // posted.innerHTML = contents.post;
    // posted.setAttribute('class', "text-wrap");
    // container.appendChild(posted);

   
    
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
    let creator = (contents.viewer === contents.poster_id)

    if (creator) {

        var svgDelete = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgDelete.setAttribute("width", "25px");
        svgDelete.setAttribute("height", "25px");
        svgDelete.setAttribute("viewBox", "0 0 24 24");
        svgDelete.setAttribute("fill", "none");
        svgDelete.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgDelete.classList.add("svg-container");
        svgDelete.classList.add("svg-fill"); // Added classList.add to avoid overwriting existing class

        // Create path elements for the fire emoji
        var dpath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath1.setAttribute("opacity", "0.5");
        dpath1.setAttribute("d", "M10 12V17");
        dpath1.setAttribute('stroke', "red");
        dpath1.id = `${contents.id}_delete1`;
        dpath1.classList.add("path1");
        dpath1.classList.add("path-danger"); // Added class for danger color

        var dpath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath2.setAttribute("opacity", "0.5");
        dpath2.setAttribute("d", "M14 12V17");
        dpath2.setAttribute('stroke', "red");
        dpath2.id = `${contents.id}_delete2`;
        dpath2.classList.add("path2");
        dpath2.classList.add("path-danger"); // Added class for danger color

        var dpath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath3.setAttribute("opacity", "0.5");
        dpath3.setAttribute("d", "M4 7H20");
        dpath3.setAttribute('stroke', "red");
        dpath3.id = `${contents.id}_delete3`;
        dpath3.classList.add("path3");
        dpath3.classList.add("path-danger"); // Added class for danger color

        var dpath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath4.setAttribute("opacity", "0.5");
        dpath4.setAttribute("d", "M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10");
        dpath4.setAttribute('stroke', "red");
        dpath4.id = `${contents.id}_delete4`;
        dpath4.classList.add("path4");
        dpath4.classList.add("path-danger"); // Added class for danger color

        var dpath5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath5.setAttribute("opacity", "0.5");
        dpath5.setAttribute("d", "M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z");
        dpath5.setAttribute('stroke', "red");
        dpath5.id = `${contents.id}_delete5`;
        dpath5.classList.add("path5");
        dpath5.classList.add("path-danger"); // Added class for danger color


        svgDelete.appendChild(dpath1);
        svgDelete.appendChild(dpath2);
        svgDelete.appendChild(dpath3);
        svgDelete.appendChild(dpath4);
        svgDelete.appendChild(dpath5);


        svgDelete.onclick = function() {
            id = contents.id;
            Swal.fire({
                title: 'Are you sure to delete?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                deleted(event, id);
                }
              });
            
        };
    
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
    let commentContainer = document.createElement('div');
    commentContainer.setAttribute('class', 'comment-div');
    commentContainer.setAttribute('id', `comment_container`);

    let comment = document.createElement('p');
    let divcomment = document.createElement('div'); 
    divcomment.setAttribute("id", `${contents.id}_comment`);

    let divMcomment = document.createElement('div'); 
    divcomment.setAttribute("id", `${contents.id}_Mcomment`);

    let divC = document.createElement('div');
    comment.innerHTML = "comment";
    comment.id = ( `${contents.id}_commentC`);
    divC.appendChild(comment);
    let commentsContainer = document.createElement('div');
    commentsContainer.setAttribute("id", `${contents.id}_comments`);
    let comments = document.createElement('p'); 
    comments.setAttribute("id", `${contents.id}_commentss`);
    comments.innerHTML = "comments";
    commentsContainer.appendChild(comments);

    commentContainer.appendChild(commentsContainer);
    commentContainer.appendChild(divMcomment);
    commentContainer.appendChild(divcomment);
    commentContainer.appendChild(divC);
    
    comment.addEventListener("mouseover", function() {
        comment.style.cursor = "pointer";
    });
    comments.addEventListener("mouseover", function() {
        comments.style.cursor = "pointer";
        counterComment = 0;
    });

    comment.onclick = ()=> {
        let id = contents.id;

        comment.onclick = null;
        comment_(event, id, contents);
    }
    comments.onclick = ()=> {
        let id = contents.id;
        commentsList(event, id, contents);
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
    let interactionContainer = document.createElement('div');
    interactionContainer.setAttribute('class', 'interaction-div');
    interactionContainer.appendChild(likeContainer);
    if (creator){
        interactionContainer.appendChild(svgDelete);
    }
    let containerInfo = document.createElement('div');
    containerInfo.setAttribute('class', 'container-info');
    containerInfo.appendChild(interactionContainer);
    containerInfo.appendChild(date);
    post.appendChild(containerInfo);
    post.appendChild(commentContainer);
   
    
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
        let post = document.getElementById(`${content.id}_content`);
        while (container.firstChild) {
            container.firstChild.remove();
        }
        // console.log(container)
        let edited_content = document.createElement('textarea');
        edited_content.setAttribute("class", "form-control");
        edited_content.setAttribute("id", `${id}_content`);
        let edit_button = document.createElement('button');
        edit_button.setAttribute("id", `${id}_edit`);
        edit_button.setAttribute("class", "btn btn-primary");
        edited_content.value = post.innerHTML;

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
                    while (container.firstChild) {
                        container.firstChild.remove();
                    }
                    contentID = `${content.id}_content`
                    
                    let edited_content = document.createElement('h5');
                    edited_content.setAttribute("id", `${id}_content`);
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

function deleted(event, id) {

    fetch(`post/delete`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'id': id
        })
    }).then((response) => {
        if (response.ok){
            document.getElementById(`${id}_post`).remove();
        }})
        .catch(error => {
                console.error('Error:', error);
            });

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
    const postButton = document.getElementById("postButton");
    postButton.disabled = true;
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


function profile(event, content, isFollowClick) {
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
                previous = document.getElementById("posts");
                previous.innerHTML = ""; 
                window.scrollTo(0, 0);
            }
            isLoading = true;
            // console.log(`${(data.posts)} posts ${data.posts.posts} post`);
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

    if (contentGlobe === "null") {
        contentGlobe = data.userProfile;
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

function comment_(event, id , contents){
    event.preventDefault();
    const commentContainer = document.getElementById(`${contents.id}_Mcomment`);
    commentBox = document.createElement("textarea");
    commentBox.setAttribute('autofocus', 'true');
    commentBox.setAttribute("class", "form-control");
    commentBox.setAttribute("id", `${contents.id}_commentBox`);
    let comment_button = document.createElement('button');
    comment_button.innerHTML = "Comment";
    comment_button.setAttribute("id", `${contents.id}_button`);
    comment_button.setAttribute("class", "btn btn-primary");
    commentContainer.prepend(comment_button);
    commentContainer.prepend(commentBox);
    comment_button.addEventListener("mouseover", function() {
        comment_button.style.cursor = "pointer";
    });
    comment_button.disabled = true;

    commentBox.onkeyup = (event) => {
        comment_button.disabled = false;
        comment_button.onclick = (e) => {
            e.preventDefault();
            commentContent = event.target.value;
            fetch('comment',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
                },
                body: JSON.stringify({
                    'id': id,
                    'comment': commentContent
                })
            }).then((response) => {
                if (response.ok){
                    commentContainer.innerHTML = "";
                    commentsList(event, id, contents);
                    let commentClick = document.getElementById(`${contents.id}_commentC`);
                    commentClick.onclick = () => {
                        let id = contents.id;
                        comment_(event, id, contents);
                        commentClick.onclick = null;
                    };

            }})
            .catch(error => {
                    console.error('Error:', error);
                });

    }



}
}
function commentsList(event, id, content) {
    if (!paginationState[content.id]) {
        paginationState[content.id] = {
            start: 0,
            end: quantityComment - 1,
        
        };
    }

    // Extract pagination state for this comment view
    const { start, end } = paginationState[content.id];

    fetch(`/comments?id=${id}&start=${start}&end=${end}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data.comments);
        // Check if data.posts is an array
        if (Array.isArray(data.comments)&& (data.comments).length > 0) {
            // If it's an array, iterate over each post'
            let info = document.getElementById(`${content.id}_comments`);
            info.innerHTML = "";
            
            for (let comment of data.comments){
                // Pass each post object to profileStats and add_post functions
                add_comment(comment,content);
            }
            let more = document.getElementById(`${content.id}_more`);
            if (more === null){
                more = document.createElement("p")
                more.innerHTML = "more comments...";
                more.setAttribute("id", `${content.id}_more`);
                document.getElementById(`${content.id}_comments`).appendChild(more);

            }
            

            more.onclick = function(event) {
                //update pagination
                paginationState[content.id].start = end + 1;
                paginationState[content.id].end = end + quantityComment;

                commentsList(event, id, content);
            };
            

        } else  if (paginationState[content.id].start === 0){
            // If no comments found
            let info = document.getElementById(`${content.id}_comments`);
            info.innerHTML = "";
            let post = document.createElement('p');
            post.innerHTML = "0 comments found";
            info.appendChild(post);
        }
        else {
            let more = document.getElementById(`${content.id}_more`);
            more.innerHTML = "No more comments"; 

            more.onclick = function(event) {
                //update pagination
                paginationState[content.id].start = end + 1;
                paginationState[content.id].end = end + quantityComment;

                commentsList(event, id, content);
            };
        }
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function add_comment(comment,content) {
    let divComment = document.createElement("div");
    divComment.className =  "comment-divs";
    divComment.setAttribute("id", `${comment.id}_comment`);
    let commenter = document.createElement("p");
    commenter.setAttribute("id", `${comment.id}_commenter`);
    commenter.className = "commenter";
    let comment_text = document.createElement("p");
    comment_text.innerHTML = `${comment.comment}`;
    commenter.innerHTML = `@${comment.commenter}`;
    divComment.appendChild(commenter);
    divComment.appendChild(comment_text);
    
    if (comment.commenter === comment.user) {
        let edit_button = document.createElement('button');
        edit_button.innerHTML = "Edit";
        edit_button.className = "btn btn-secondary";
        let delete_button = document.createElement('button');
        delete_button.innerHTML = "Delete";
        delete_button.className = "btn btn-danger";
        divComment.appendChild(edit_button);
        divComment.appendChild(delete_button);
        edit_button.addEventListener("mouseover", function() {
            edit_button.style.cursor = "pointer";
        });
        delete_button.addEventListener("mouseover", function() {
            delete_button.style.cursor = "pointer";
        });
        edit_button.onclick = function(event) {
            editComment(event, comment, content);
        };
        delete_button.onclick = function(event) {
            deleteComment(event, comment, content);
        };
    }
    
    // Append the divComment to your desired container or element
    
    document.getElementById(`${content.id}_comments`).prepend(divComment);
    
}

function editComment(event, comment,content) {
    event.preventDefault();
    let divComment = document.getElementById(`${comment.id}_comment`);
    divComment.innerHTML = "";
    let commenter = document.createElement("p");
    commenter.setAttribute("class", "commenter");
    commenter.innerHTML = comment.commenter;
    let comment_text = document.createElement("textarea");
    comment_text.id = (`${comment.id}_commentBox`);
    comment_text.value = comment.comment;
    comment_text.setAttribute("class", "form-control");
    let edit_button = document.createElement("button");
    edit_button.id = `${comment.id}_button`;
    edit_button.innerHTML = "Edit comment";
    edit_button.className = "btn btn-primary";


    divComment.appendChild(commenter);
    divComment.appendChild(comment_text);
    divComment.appendChild(edit_button);

    edit_button.addEventListener("mouseover", function() {
        edit_button.style.cursor = "pointer";
    });
    edit_button.disabled = true;
    comment_text.onkeyup = (event) => {
        edit_button.disabled = false;
        edit_button.onclick = (e) => {
            commentContent = event.target.value;
            fetch('editComment',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
                },
                body: JSON.stringify({
                    'id': content.id,
                    'comment': commentContent
                })
            }).then((response) => {
                if (response.ok){
                    divComment.innerHTML = "";
                    let comment_text = document.createElement("p")
                    comment_text.innerHTML = commentContent ;
                    divComment.appendChild(comment_text)

                    let edit_button = document.createElement('button');
                    edit_button.innerHTML = "Edit";
                    edit_button.className = "btn btn-secondary"
                    let delete_button = document.createElement('button');
                    delete_button.innerHTML = "Delete";
                    delete_button.className = "btn btn-danger"

                    divComment.appendChild(edit_button)
                    divComment.appendChild(delete_button)

                    edit_button.addEventListener("mouseover", function() {
                    edit_button.style.cursor = "pointer";
                });
                delete_button.addEventListener("mouseover", function() {
                    delete_button.style.cursor = "pointer";
                });
                edit_button.onclick = function(event) {
                    editComment(event, comment);
                };
                delete_button.onclick = function(event) {
                    deleteComment(event, comment);
                };


            }})
            .catch(error => {
                    console.error('Error:', error);
                });

    }



}
    
}

function deleteComment(event, comment, content) {
    event.preventDefault();
    let delete_button = document.getElementById(`${content.id}_delete_button`);
    fetch('delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'id': comment.id
        })
    }).then((response) => {
        if (response.ok){
            document.getElementById(`${comment.id}_comment`).remove();
        }})
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