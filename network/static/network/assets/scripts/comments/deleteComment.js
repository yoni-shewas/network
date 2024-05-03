import { getCookie } from "../cookies/getCookie";

export function deleteComment(event, comment, content, document) {
    event.preventDefault();
    let delete_button = document.getElementById(`${content.id}_delete_button`);
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
         let comment = document.getElementById(`${comment.id}_comment`);

            
            if (comment) {
                // Apply CSS transition for fading effect
                comment.style.transition = "opacity 0.25s ease";
        
                // Set opacity to 0 to start the fading effect
                comment.style.opacity = 0;
        
                // After a short delay, remove the post from the DOM
                setTimeout(() => {
                    comment.remove();
                }, 200); // Adjust the delay (in milliseconds) based on the transition duration
            }
        }})
        .catch(error => {
                console.error('Error:', error);
            });
}
