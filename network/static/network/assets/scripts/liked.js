import { getCookie } from "./cookies/getCookie";

export function liked(event, id, document) {
    // Prevent default behavior of the event
    let pathId1 = `${id}_fill1`;
    let pathID2 = `${id}_fill2`;
     let path1 = document.getElementById(pathId1);
     let path2 = document.getElementById(pathID2);
    event.preventDefault();

    fetch('like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken', document) // Function to retrieve CSRF token from cookie
        },
        body: JSON.stringify({
            'id': id
        })
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        // Now you can access the data returned from the server
        if (data && data.likes !== undefined) {
            // Request was successful
            // console.log(data);
            if (path1) {
                // console.log(path1);
                if (data.isLiked){
                    path1.setAttribute("fill", "#2c29e2");
                    path2.setAttribute("fill", "#00BFFF");
                }
                else{
                    path1.setAttribute('fill', "#1E1E1E"); 
                    path2.setAttribute('fill', "#0c2c67");
                }
                
            } else {
                console.error('Path element not found:', pathId);
            }
            let likeId = `${id}_like`

            let L = document.getElementById(likeId);
            if (L) {
                let likes = data.likes;
                L.innerHTML = likes;
            } else {
                console.error('Element not found:', id);
            }

            // console.log('Request successful');
        } else {
            // Request failed or response is unexpected
            console.error('Request failed or response is unexpected');
        }
        // load();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
