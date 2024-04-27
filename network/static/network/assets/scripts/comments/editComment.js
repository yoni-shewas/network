import { getCookie } from "../cookies/getCookie";
import { deleteComment } from "./deleteComment";

export function editComment(event, comment,content,document) {
    event.preventDefault();
    let divComment = document.getElementById(`${comment.id}_comment`);
    divComment.innerHTML = "";
    let commenter = document.createElement("p");
    commenter.setAttribute("class", "commenter");
    commenter.innerHTML = comment.commenter;
    let comment_text = document.createElement("textarea");
    comment_text.id = (`${comment.id}_commentBox`);
    comment_text.setAttribute('maxlength', '150');
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
           let commentContent = event.target.value;
            fetch('editComment',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken',document) // Function to retrieve CSRF token from cookie
                },
                body: JSON.stringify({
                    'id': content.id,
                    'comment': commentContent
                })
            }).then((response) => {
                if (response.ok){
                    divComment.innerHTML = "";
                    let comment_text = document.createElement("p")
                    comment_text.className = "text-wrap text-break";
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
                    editComment(event, comment,document);
                };
                delete_button.onclick = function(event) {
                    deleteComment(event, comment,document);
                };


            }})
            .catch(error => {
                    console.error('Error:', error);
                });

    }



}
    
}