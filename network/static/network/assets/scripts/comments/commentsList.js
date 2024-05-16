const quantityComment = 5;
const paginationState = {};

import {add_comment} from "./add_comment";
export function commentsList(event, id, content,document) {
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
        // console.log(data.comments);
        // Check if data.posts is an array
        if (Array.isArray(data.comments)&& (data.comments).length > 0) {
            // If it's an array, iterate over each post'
            let info = document.getElementById(`${content.id}_comments`);
            info.innerHTML = "";
            
            for (let comment of data.comments){
                // Pass each post object to profileStats and add_post functions
                add_comment(comment,content,document);
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

                commentsList(event, id, content,document);
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

                commentsList(event, id, content,document);
            };
        }
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
