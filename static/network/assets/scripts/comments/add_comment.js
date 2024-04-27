import { editComment } from "./editComment";
import { deleteComment } from "./deleteComment";

export function add_comment(comment,content, document) {
    let divComment = document.createElement("div");
    divComment.className =  "comment-divs";
    divComment.setAttribute("id", `${comment.id}_comment`);
    let commenter = document.createElement("p");
    commenter.setAttribute("id", `${comment.id}_commenter`);
    commenter.className = "commenter";
    let comment_text = document.createElement("p");
    comment_text.innerHTML = `${comment.comment}`;
    comment_text.className = "text-wrap text-break";
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
            editComment(event, comment, content,document);
        };
        delete_button.onclick = function(event) {
            deleteComment(event, comment, content,document);
        };
    }
    
    // Append the divComment to your desired container or element
    
    document.getElementById(`${content.id}_comments`).prepend(divComment);
    
}
