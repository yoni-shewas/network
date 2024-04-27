// Start with first post
let counter = 0;

import { add_post } from './src/addPost';

// Load posts 20 at a time
const quantity = 10;
const quantityComment = 5;

// Start with first post
let counterP = 0; 
let counterComment= 0; 

// Load posts 20 at a time
const quantityP = 10;

let isLoading = false;


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


     // Get the textarea element
     var textarea = document.getElementById("post");

     // Add event listener for input events
     textarea.addEventListener("input", function() {
       // Get the current word count
       var wordCount = this.value.length;
 
       // Update the word count display
       document.getElementById("wordCount").textContent = wordCount + " / 200 Characters";
 
       button = document.getElementById("postButton");
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
                add_post(post);
            });
        } else {
            // If it's not an array, handle it accordingly (e.g., log an error)
            console.error("Data.posts is not an array:", data.posts);
        }

    })




    
};



  

function Edit(event, id, content){

    event.preventDefault();
    let contain = `${id}_container`;
    
    try{
        let container = document.getElementById(contain);
        let post = document.getElementById(`${content.id}_posted`);
        let edit = document.getElementById(`${content.id}_edit`);

        edit.remove();
      
        while (container.firstChild) {
            container.firstChild.remove();
        }
        // console.log(container)
        let edited_content = document.createElement('textarea');
        edited_content.setAttribute("class", "form-control commentInput");
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
            edit_button.disabled = true;
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
                    container.innerHTML = "";                 
            
                    post.innerHTML = post_content;
                    container.append(post);

                    postC = document.getElementById(`${content.id}_post`)
                    
                    let edit = document.createElement('a');
                    edit.innerHTML = 'Edit';
                    edit.setAttribute("id", `${content.id}_edit`);        
                    edit.setAttribute("class", "text-primary");
                    edit.addEventListener("mouseover", function() {
                
                       edit.style.cursor = "pointer";

                    });
                    
                    postC.prepend(edit);

                    edit.onclick = function() {
                        let id = content.id;
            
                        Edit(event, id, content);
                        
                    };


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
//     event.preventDefault();`
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