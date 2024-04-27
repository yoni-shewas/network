import {getCookie} from './cookies/getCookie';


export function Edit(event, id, content, document){

    event.preventDefault();
    let contain = `${id}_container`;
    
    try{
        let container = document.getElementById(contain);
        let post = document.getElementById(`${content.id}_posted`);
        // let edit = document.getElementById(`${content.id}_edit`);

        // edit.remove();
      
        while (container.firstChild) {
            container.firstChild.remove();
        }
        // console.log(container)
        let edited_content = document.createElement('textarea');
        edited_content.setAttribute("class", "form-control commentInput");
        edited_content.setAttribute("id", `${id}_content`);
        let edit_button = document.createElement('button');
        edit_button.setAttribute("id", `${id}_edit`);
        edit_button.setAttribute("class", "btn btn-primary");
        edited_content.value = post.innerHTML;

        edit_button.innerHTML = "Edit";
        container.appendChild(edited_content);
        container.appendChild(edit_button);
        edit_button.addEventListener("mouseover", function() {
            edit_button.style.cursor = "pointer";
        });
        edit_button.disabled = true;
        edited_content.onkeyup = function(event){

        edit_button.disabled = false;
        
        edit_button.onclick = function(e) {
            edit_button.disabled = true;
            let post_content = event.target.value
            fetch('edit',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken', document) 
                },
                body: JSON.stringify({
                    'id': id,
                    'content': post_content
                })
            }).then(response => {
                // Check if the update was successful
                if (response.ok) {
                    container.innerHTML = "";                 
            
                    post.innerHTML = post_content;
                    container.append(post);

                    let postC = document.getElementById(`${content.id}_post`)
                    
                    // let edit = document.createElement('a');
                    // edit.innerHTML = 'Edit';
                    // edit.setAttribute("id", `${content.id}_edit`);        
                    // edit.setAttribute("class", "text-primary");
                    // edit.addEventListener("mouseover", function() {
                
                    //    edit.style.cursor = "pointer";

                    // });
                    
                    // postC.prepend(edit);

                    // edit.onclick = function() {
                    //     let id = content.id;
            
                    //     Edit(event, id, content);
                        
                    // };


                } else {
                    console.error('Error updating content:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
            edit_button.addEventListener("mouseover", function() {
                edit_button.style.cursor = "pointer";
            });
        }


        }
        catch (error ) {
            console.error('Error:', error);
        }


}
