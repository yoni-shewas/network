import {getCookie} from "../cookies/getCookie";
import { commentsList } from "./commentsList";

export function comment_(event, id , contents,document){
    event.preventDefault();
    const commentContainer = document.getElementById(`${contents.id}_Mcomment`);
    let commentBox = document.createElement("textarea");
    commentBox.setAttribute('autofocus', 'true');
    commentBox.setAttribute("class", "form-control");
    commentBox.setAttribute("id", `${contents.id}_commentBox`);
    commentBox.setAttribute('maxlength', '150');
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
        var commentContent = event.target.value;
        var wordCount = commentContent.length;
        if (wordCount > 150) {
            comment_button.disabled = true;
          }
        else{
            comment_button.disabled = false;
        }

        comment_button.onclick = (e) => {
            e.preventDefault();
            comment_button.disabled = true;
            let commentContent = event.target.value;
            fetch('comment',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken', document) 
                },
                body: JSON.stringify({
                    'id': id,
                    'comment': commentContent
                })
            }).then((response) => {
                if (response.ok){
                    commentContainer.innerHTML = "";
                    commentsList(event, id, contents,document);
                    let commentClick = document.getElementById(`${contents.id}_commentC`);
                    commentClick.onclick = () => {
                        let ids = contents.id;
                        comment_(event, ids, contents,document);
                        commentClick.onclick = null;
                    };

            }})
            .catch(error => {
                    console.error('Error:', error);
                });

    }



}
}