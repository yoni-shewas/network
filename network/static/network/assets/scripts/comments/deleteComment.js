import { getCookie } from "../cookies/getCookie";

export function deleteComment(event, comment, content, document) {
    event.preventDefault();
    let delete_button = document.getElementById(`${content.id}_delete_button`);
    console.log(comment);
    // console.log(content);
    fetch('delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken',document) // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'id': comment.id
        })
    }).then((response) => {
        if (response.ok){
            let diVcomment = document.getElementById(`${comment.id}_comment`);
            console.log(diVcomment);
            
            if (diVcomment) {
                // Apply CSS transition for fading effect
                diVcomment.style.transition = "opacity 0.25s ease";
        
                // Set opacity to 0 to start the fading effect
                diVcomment.style.opacity = 0;
        
                // After a short delay, remove the post from the DOM
                setTimeout(() => {
                    diVcomment.remove();
                }, 200); // Adjust the delay (in milliseconds) based on the transition duration
            }
        }})
        .catch(error => {
                console.error('Error:', error);
            });
}
