import { getCookie } from "./cookies/getCookie";


export function follow(event, data, document) {
    let pathId = `${data.userProfile}_follow`;
    let followID = `${data.currentUser}_followers`;
    let path = document.getElementById(pathId);
    let follow = document.getElementById(followID);
    event.preventDefault();

    fetch('/follow', { // Ensure the correct URL is used
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken', document) // Function to retrieve CSRF token from cookie
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