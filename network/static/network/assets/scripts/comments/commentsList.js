const quantityComment = 5;
const paginationState = {};

import { add_comment } from "./add_comment";

export function commentsList(event, id, content, document) {
    // Check if pagination state exists for the content ID, initialize if not
    if (!paginationState[content.id]) {
        paginationState[content.id] = {
            start: 0,
            end: quantityComment - 1,
        };
    }

    // Extract pagination state for this comment view
    const { start, end } = paginationState[content.id];

    // Fetch comments for the given ID and pagination parameters
    fetch(`/comments?id=${id}&start=${start}&end=${end}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then((data) => {
        // Check if comments are available in the response
        if (Array.isArray(data.comments) && data.comments.length > 0) {
            // Clear existing comments before adding new ones
            let commentsContainer = document.getElementById(`${content.id}_comments`);
            commentsContainer.innerHTML = "";
            
            // Iterate over each comment and add it to the DOM
            data.comments.forEach(comment => {
                add_comment(comment, content, document);
            });

            // Add a "more comments..." link if not already present
            let moreCommentsLink = document.getElementById(`${content.id}_more`);
            if (!moreCommentsLink) {
                moreCommentsLink = document.createElement("p");
                moreCommentsLink.innerHTML = "more comments...";
                moreCommentsLink.setAttribute("id", `${content.id}_more`);
                commentsContainer.appendChild(moreCommentsLink);
            }

            // Update pagination state and reload comments when "more comments..." is clicked
            moreCommentsLink.onclick = function(event) {
                paginationState[content.id].start = end + 1;
                paginationState[content.id].end = end + quantityComment;
                commentsList(event, id, content, document);
            };
        } else if (paginationState[content.id].start === 0) {
            // No comments found
            let commentsContainer = document.getElementById(`${content.id}_comments`);
            commentsContainer.innerHTML = "";
            let noCommentsMessage = document.createElement('p');
            noCommentsMessage.innerHTML = "0 comments found";
            commentsContainer.appendChild(noCommentsMessage);
        } else {
            // No more comments available
            let moreCommentsLink = document.getElementById(`${content.id}_more`);
            moreCommentsLink.innerHTML = "No more comments";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
