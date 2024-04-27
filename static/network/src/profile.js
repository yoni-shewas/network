export function profile(event, content, isFollowClick) {
    const startP = counterP;
    const endP = startP + quantityP - 1;
    counterP = endP + 1;
    
    if (isFollowClick) {

        contentGlobe = "null";
        isFollowClick = false;
    }
    else{
        contentGlobe = content || "null";
    }
    console.log(`${contentGlobe} contentG and ${content}`);
    
    fetch(`/profile?startP=${startP}&endP=${endP}&user=${contentGlobe}`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        // Check if data.posts is an array
        if (Array.isArray(data.posts.posts)) {
            // If it's an array, iterate over each post
            if(!isLoading){
                previous = document.getElementById("posts");
                previous.innerHTML = ""; 
                window.scrollTo(0, 0);
            }
            isLoading = true;
            // console.log(`${(data.posts)} posts ${data.posts.posts} post`);
            for (let post of data.posts.posts){
                // Pass each post object to profileStats and add_post functions
                // console.log(post);
                console.log(data.posts)
                profileStats(data.posts);
                console.log(data.posts)
                add_post(post);
            }
        } else {
            // If it's not an array, handle it accordingly (e.g., log an error)
            console.error("Data.posts is not an array:", data.posts);
        }

    })
}
