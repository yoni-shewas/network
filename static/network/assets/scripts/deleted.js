import { getCookie } from "./cookies/getCookie";

export function deleted(event, id, document) {

    fetch(`post/delete`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken', document) // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'id': id
        })
    }).then((response) => {
        if (response.ok){
            let post = document.getElementById(`${id}_post`);

            if (post) {
                // Apply CSS transition for fading effect
                post.style.transition = "opacity 0.25s ease";
        
                // Set opacity to 0 to start the fading effect
                post.style.opacity = 0;
        
                // After a short delay, remove the post from the DOM
                setTimeout(() => {
                    post.remove();
                }, 200); // Adjust the delay (in milliseconds) based on the transition duration
            }
        }})
        .catch(error => {
                console.error('Error:', error);
            });

}
