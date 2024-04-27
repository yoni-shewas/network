import { Edit } from "./edit";
import { commentsList } from "./comments/commentsList";
import { comment_ } from "./comments/comment_";
import { profile } from "../index";
import {deleted} from "./deleted";
import { liked } from "./liked";


export function add_post(contents,document, counterComment,isTop=false  ) {


    // Create new post
    const post = document.createElement('div');
    post.className = "post";
    post.id = `${contents.id}_post`;

    
    let poster = document.createElement('h4');
    poster.innerHTML = `@${contents.poster}`;
    poster.className = "poster";
    poster.id = `${contents.poster}_poster`;

    poster.addEventListener("mouseover", function() {
        poster.style.cursor = "pointer";
    });

    poster.onclick = function(event){
        event.preventDefault();
        // window.location.href = `/profile/${contents.poster}`;
        profile(event, contents.poster, false);
    }

   
    let container = document.createElement('div');
    let containerID =  `${contents.id}_container`;
    container.className = "PostContainer text-wrap text-break";

    let paragraph = document.createElement('p');
    paragraph.className = "text-wrap text-break";
    paragraph.textContent = contents.post;
    paragraph.setAttribute('id', `${contents.id}_posted`);
    // Append the <p> element to the container
    container.appendChild(paragraph);

    container.setAttribute('id',containerID);
    // let posted = document.createElement('h5');
    // posted.innerHTML = contents.post;
    // posted.setAttribute('class', "text-wrap");
    // container.appendChild(posted);

   
    
    if(contents.edited){
        let edited = document.createElement('a');
        edited.innerHTML = 'Edited';
    }

    let date = document.createElement('p');
    date.innerHTML = contents.date;
    

    

        // Create SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "25px");
    svg.setAttribute("height", "25px");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.classList.add("svg-container");
    svg.setAttribute("class", "svg-fill");

    // Create path element for the fire emoji
    var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("opacity", "0.5");
    path1.setAttribute("d", "M12.8324 21.8013C15.9583 21.1747 20 18.926 20 13.1112C20 7.8196 16.1267 4.29593 13.3415 2.67685C12.7235 2.31757 12 2.79006 12 3.50492V5.3334C12 6.77526 11.3938 9.40711 9.70932 10.5018C8.84932 11.0607 7.92052 10.2242 7.816 9.20388L7.73017 8.36604C7.6304 7.39203 6.63841 6.80075 5.85996 7.3946C4.46147 8.46144 3 10.3296 3 13.1112C3 20.2223 8.28889 22.0001 10.9333 22.0001C11.0871 22.0001 11.2488 21.9955 11.4171 21.9858C11.863 21.9296 11.4171 22.085 12.8324 21.8013Z");
    path1.setAttribute('fill', "#0c2c67");
    path1.id = `${contents.id}_fill1`;
    path1.setAttribute("class", "path1");

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M8 18.4442C8 21.064 10.1113 21.8742 11.4171 21.9858C11.863 21.9296 11.4171 22.085 12.8324 21.8013C13.871 21.4343 15 20.4922 15 18.4442C15 17.1465 14.1814 16.3459 13.5401 15.9711C13.3439 15.8564 13.1161 16.0008 13.0985 16.2273C13.0429 16.9454 12.3534 17.5174 11.8836 16.9714C11.4685 16.4889 11.2941 15.784 11.2941 15.3331V14.7439C11.2941 14.3887 10.9365 14.1533 10.631 14.3346C9.49507 15.0085 8 16.3949 8 18.4442Z");
    path2.setAttribute('fill', "#0c2c67");
    path2.id = `${contents.id}_fill2`;
    path2.setAttribute("class", "path2");


    // Append path elements to SVG element
    svg.appendChild(path1);
    svg.appendChild(path2);

    svg.onclick = function() {
        let id = contents.id;
        liked(event, id,document);
    };



    if(contents.liked){
        path1.setAttribute('fill', "#2c29e2" )
        path2.setAttribute('fill', "#00BFFF" )
    }

    let like = document.createElement('p');
    like.innerHTML = contents.likes;
    let likeId = `${contents.id}_like`;
    like.setAttribute("id", likeId );

    



    
    post.appendChild(poster);
    let creator = (contents.viewer === contents.poster_id)

    if (creator) {

        var svgDelete = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgDelete.setAttribute("width", "25px");
        svgDelete.setAttribute("height", "25px");
        svgDelete.setAttribute("viewBox", "0 0 24 24");
        svgDelete.setAttribute("fill", "none");
        svgDelete.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgDelete.classList.add("svg-container");
        svgDelete.classList.add("svg-fill"); // Added classList.add to avoid overwriting existing class

        // Create path elements for the fire emoji
        var dpath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath1.setAttribute("opacity", "0.5");
        dpath1.setAttribute("d", "M10 12V17");
        dpath1.setAttribute('stroke', "red");
        dpath1.id = `${contents.id}_delete1`;
        dpath1.classList.add("path1");
        dpath1.classList.add("path-danger"); // Added class for danger color

        var dpath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath2.setAttribute("opacity", "0.5");
        dpath2.setAttribute("d", "M14 12V17");
        dpath2.setAttribute('stroke', "red");
        dpath2.id = `${contents.id}_delete2`;
        dpath2.classList.add("path2");
        dpath2.classList.add("path-danger"); // Added class for danger color

        var dpath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath3.setAttribute("opacity", "0.5");
        dpath3.setAttribute("d", "M4 7H20");
        dpath3.setAttribute('stroke', "red");
        dpath3.id = `${contents.id}_delete3`;
        dpath3.classList.add("path3");
        dpath3.classList.add("path-danger"); // Added class for danger color

        var dpath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath4.setAttribute("opacity", "0.5");
        dpath4.setAttribute("d", "M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10");
        dpath4.setAttribute('stroke', "red");
        dpath4.id = `${contents.id}_delete4`;
        dpath4.classList.add("path4");
        dpath4.classList.add("path-danger"); // Added class for danger color

        var dpath5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dpath5.setAttribute("opacity", "0.5");
        dpath5.setAttribute("d", "M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z");
        dpath5.setAttribute('stroke', "red");
        dpath5.id = `${contents.id}_delete5`;
        dpath5.classList.add("path5");
        dpath5.classList.add("path-danger"); // Added class for danger color


        svgDelete.appendChild(dpath1);
        svgDelete.appendChild(dpath2);
        svgDelete.appendChild(dpath3);
        svgDelete.appendChild(dpath4);
        svgDelete.appendChild(dpath5);


        svgDelete.onclick = function() {
            let id = contents.id;
            Swal.fire({
                title: 'Are you sure to delete?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                deleted(event, id, document);
                }
              });
            
        };
    
        let edit = document.createElement('a');
        edit.innerHTML = 'Edit';
        edit.setAttribute("id", `${contents.id}_edit`);        
        edit.setAttribute("class", "text-primary");
        edit.addEventListener("mouseover", function() {
    
            edit.style.cursor = "pointer";

        });
            post.appendChild(edit);
    
        // Attach onclick event handler
        edit.onclick = function() {
            let id = contents.id;

            // let content = contents.post; // Corrected assignment
            Edit(event, id, contents,document);
            
        };
    }
    post.appendChild(container);
    let commentContainer = document.createElement('div');
    commentContainer.setAttribute('class', 'comment-div');
    commentContainer.setAttribute('id', `comment_container`);

    let comment = document.createElement('p');
    let divcomment = document.createElement('div'); 
    divcomment.setAttribute("id", `${contents.id}_comment`);

    let divMcomment = document.createElement('div'); 
    divcomment.setAttribute("id", `${contents.id}_Mcomment`);

    let divC = document.createElement('div');
    comment.innerHTML = "comment";
    comment.id = ( `${contents.id}_commentC`);
    divC.appendChild(comment);
    let commentsContainer = document.createElement('div');
    commentsContainer.setAttribute("id", `${contents.id}_comments`);
    let comments = document.createElement('p'); 
    comments.setAttribute("id", `${contents.id}_commentss`);
    comments.innerHTML = "comments";
    commentsContainer.appendChild(comments);

    commentContainer.appendChild(commentsContainer);
    commentContainer.appendChild(divMcomment);
    commentContainer.appendChild(divcomment);
    commentContainer.appendChild(divC);
    
    comment.addEventListener("mouseover", function() {
        comment.style.cursor = "pointer";
    });
    comments.addEventListener("mouseover", function() {
        comments.style.cursor = "pointer";
        counterComment = 0;
    });

    comment.onclick = ()=> {
        let id = contents.id;

        comment.onclick = null;
        comment_(event, id, contents,document);
    }
    comments.onclick = ()=> {
        let id = contents.id;
        commentsList(event, id, contents, document);
    }
   
    
    

    if(contents.edited){
        let edited = document.createElement('a');
        edited.innerHTML = 'Edited';
        post.appendChild(edited)
    }
    let likeContainer = document.createElement('div');
    likeContainer.setAttribute('class', 'like-div');
    likeContainer.appendChild(svg);
    likeContainer.appendChild(like);
    let interactionContainer = document.createElement('div');
    interactionContainer.setAttribute('class', 'interaction-div');
    interactionContainer.appendChild(likeContainer);
    if (creator){
        interactionContainer.appendChild(svgDelete);
    }
    let containerInfo = document.createElement('div');
    containerInfo.setAttribute('class', 'container-info');
    containerInfo.setAttribute('id', `${contents.id}_before`);
    containerInfo.appendChild(interactionContainer);
    containerInfo.appendChild(date);
    post.appendChild(containerInfo);
    post.appendChild(commentContainer);
   
    
    if(!isTop){
        // Add post to DOM
        document.querySelector('#posts').append(post);
    }
    else{
        document.querySelector('#posts').prepend(post);
    }
};
