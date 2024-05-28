import { editComment } from "./editComment";
import { deleteComment } from "./deleteComment";

export function add_comment(comment, content, document) {
    let divComment = document.createElement("div");
    divComment.className = "comment-divs";
    divComment.setAttribute("id", `${comment.id}_comment`);

    let commenter = document.createElement("p");
    commenter.className = "commenter";
    commenter.innerHTML = `@${comment.commenter}`;

    let comment_text = document.createElement("p");
    comment_text.className = "text-wrap text-break";
    comment_text.innerHTML = `${comment.comment}`;

    divComment.appendChild(commenter);
    divComment.appendChild(comment_text);

    // Check if the commenter is the same as the current user to add edit and delete buttons
    if (comment.commenter === comment.user) {
        let edit_button = document.createElement('button');
        edit_button.innerHTML = "Edit";
        edit_button.className = "btn btn-secondary";

        let delete_button = document.createElement('button');
        delete_button.innerHTML = "Delete";
        delete_button.className = "btn btn-danger";

        divComment.appendChild(edit_button);
        divComment.appendChild(delete_button);

        // Add event listeners to edit and delete buttons
        edit_button.addEventListener("click", function(event) {
            edit_button.disabled = true;
            delete_button.disabled = true;
            editComment(event, comment, content, document);
        });

        delete_button.addEventListener("click", function(event) {
            edit_button.disabled = true;
            delete_button.disabled = true;
            deleteComment(event, comment, content, document);
        });
    }

    // Append the divComment to the comments container
    let commentsContainer = document.getElementById(`${content.id}_comments`);
    if (commentsContainer) {
        commentsContainer.prepend(divComment);
    } else {
        console.error("Comments container not found");
    }
}
