(()=>{"use strict";var t={d:(o,r)=>{for(var i in r)t.o(r,i)&&!t.o(o,i)&&Object.defineProperty(o,i,{enumerable:!0,get:r[i]})},o:(t,o)=>Object.prototype.hasOwnProperty.call(t,o)};function getCookie(t,o){var r=null;if(o.cookie&&""!==o.cookie)for(var i=o.cookie.split(";"),a=0;a<i.length;a++){var c=i[a].trim();if(c.startsWith(t+"=")){r=decodeURIComponent(c.substring(t.length+1));break}}return r}function deleteComment(t,o,r,i){t.preventDefault();i.getElementById("".concat(r.id,"_delete_button"));fetch("delete",{method:"DELETE",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",i)},body:JSON.stringify({id:o.id})}).then((function(t){t.ok&&(o=i.getElementById("".concat(o.id,"_comment")))&&(o.style.transition="opacity 0.25s ease",o.style.opacity=0,setTimeout((function(){o.remove()}),200))})).catch((function(t){console.error("Error:",t)}))}function editComment(t,o,r,i){t.preventDefault();var a=i.getElementById("".concat(o.id,"_comment"));a.innerHTML="";var c=i.createElement("p");c.setAttribute("class","commenter"),c.innerHTML=o.commenter;var d=i.createElement("textarea");d.id="".concat(o.id,"_commentBox"),d.setAttribute("maxlength","150"),d.value=o.comment,d.setAttribute("class","form-control");var l=i.createElement("button");l.id="".concat(o.id,"_button"),l.innerHTML="Edit comment",l.className="btn btn-primary",a.appendChild(c),a.appendChild(d),a.appendChild(l),l.addEventListener("mouseover",(function(){l.style.cursor="pointer"})),l.disabled=!0,d.onkeyup=function(t){l.disabled=!1,l.onclick=function(c){var d=t.target.value;fetch("editComment",{method:"PUT",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",i)},body:JSON.stringify({id:r.id,comment:d})}).then((function(t){if(t.ok){a.innerHTML="";var r=i.createElement("p");r.className="text-wrap text-break",r.innerHTML=d,a.appendChild(r);var c=i.createElement("button");c.innerHTML="Edit",c.className="btn btn-secondary";var l=i.createElement("button");l.innerHTML="Delete",l.className="btn btn-danger",a.appendChild(c),a.appendChild(l),c.addEventListener("mouseover",(function(){c.style.cursor="pointer"})),l.addEventListener("mouseover",(function(){l.style.cursor="pointer"})),c.onclick=function(t){editComment(t,o,i)},l.onclick=function(t){deleteComment(t,o,i)}}})).catch((function(t){console.error("Error:",t)}))}}}function add_comment(t,o,r){var i=r.createElement("div");i.className="comment-divs",i.setAttribute("id","".concat(t.id,"_comment"));var a=r.createElement("p");a.setAttribute("id","".concat(t.id,"_commenter")),a.className="commenter";var c=r.createElement("p");if(c.innerHTML="".concat(t.comment),c.className="text-wrap text-break",a.innerHTML="@".concat(t.commenter),i.appendChild(a),i.appendChild(c),t.commenter===t.user){var d=r.createElement("button");d.innerHTML="Edit",d.className="btn btn-secondary";var l=r.createElement("button");l.innerHTML="Delete",l.className="btn btn-danger",i.appendChild(d),i.appendChild(l),d.addEventListener("mouseover",(function(){d.style.cursor="pointer"})),l.addEventListener("mouseover",(function(){l.style.cursor="pointer"})),d.onclick=function(i){editComment(i,t,o,r)},l.onclick=function(i){deleteComment(i,t,o,r)}}r.getElementById("".concat(o.id,"_comments")).prepend(i)}function _createForOfIteratorHelper(t,o){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function _unsupportedIterableToArray(t,o){if(!t)return;if("string"==typeof t)return _arrayLikeToArray(t,o);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _arrayLikeToArray(t,o)}(t))||o&&t&&"number"==typeof t.length){r&&(t=r);var i=0,a=function F(){};return{s:a,n:function n(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function e(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,d=!0,l=!1;return{s:function s(){r=r.call(t)},n:function n(){var t=r.next();return d=t.done,t},e:function e(t){l=!0,c=t},f:function f(){try{d||null==r.return||r.return()}finally{if(l)throw c}}}}function _arrayLikeToArray(t,o){(null==o||o>t.length)&&(o=t.length);for(var r=0,i=new Array(o);r<o;r++)i[r]=t[r];return i}t.d({},{M:()=>profile});var o=5,r={};function commentsList(t,i,a,c){r[a.id]||(r[a.id]={start:0,end:o-1});var d=r[a.id],l=d.start,u=d.end;fetch("/comments?id=".concat(i,"&start=").concat(l,"&end=").concat(u),{method:"GET",headers:{"Content-Type":"application/json"}}).then((function(t){return t.json()})).then((function(t){if(console.log(t.comments),Array.isArray(t.comments)&&t.comments.length>0){c.getElementById("".concat(a.id,"_comments")).innerHTML="";var d,l=_createForOfIteratorHelper(t.comments);try{for(l.s();!(d=l.n()).done;){add_comment(d.value,a,c)}}catch(t){l.e(t)}finally{l.f()}var p=c.getElementById("".concat(a.id,"_more"));null===p&&((p=c.createElement("p")).innerHTML="more comments...",p.setAttribute("id","".concat(a.id,"_more")),c.getElementById("".concat(a.id,"_comments")).appendChild(p)),p.onclick=function(t){r[a.id].start=u+1,r[a.id].end=u+o,commentsList(t,i,a,c)}}else if(0===r[a.id].start){var m=c.getElementById("".concat(a.id,"_comments"));m.innerHTML="";var v=c.createElement("p");v.innerHTML="0 comments found",m.appendChild(v)}else{var h=c.getElementById("".concat(a.id,"_more"));h.innerHTML="No more comments",h.onclick=function(t){r[a.id].start=u+1,r[a.id].end=u+o,commentsList(t,i,a,c)}}})).catch((function(t){console.error("Error:",t)}))}function comment_(t,o,r,i){t.preventDefault();var a=i.getElementById("".concat(r.id,"_Mcomment")),c=i.createElement("textarea");c.setAttribute("autofocus","true"),c.setAttribute("class","form-control"),c.setAttribute("id","".concat(r.id,"_commentBox")),c.setAttribute("maxlength","150");var d=i.createElement("button");d.innerHTML="Comment",d.setAttribute("id","".concat(r.id,"_button")),d.setAttribute("class","btn btn-primary"),a.prepend(d),a.prepend(c),d.addEventListener("mouseover",(function(){d.style.cursor="pointer"})),d.disabled=!0,c.onkeyup=function(t){var c=t.target.value.length;d.disabled=c>150,d.onclick=function(c){c.preventDefault(),d.disabled=!0;var l=t.target.value;fetch("comment",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",i)},body:JSON.stringify({id:o,comment:l})}).then((function(c){if(c.ok){a.innerHTML="",commentsList(0,o,r,i);var d=i.getElementById("".concat(r.id,"_commentC"));d.onclick=function(){var o=r.id;comment_(t,o,r),d.onclick=null}}})).catch((function(t){console.error("Error:",t)}))}}}function add_post(t,o,r){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],a=o.createElement("div");a.className="post",a.id="".concat(t.id,"_post");var c=o.createElement("h4");c.innerHTML="@".concat(t.poster),c.className="poster",c.id="".concat(t.poster,"_poster"),c.addEventListener("mouseover",(function(){c.style.cursor="pointer"})),c.onclick=function(o){o.preventDefault(),profile(o,t.poster,!1)};var d=o.createElement("div"),l="".concat(t.id,"_container");d.className="PostContainer text-wrap text-break";var u=o.createElement("p");(u.className="text-wrap text-break",u.textContent=t.post,u.setAttribute("id","".concat(t.id,"_posted")),d.appendChild(u),d.setAttribute("id",l),t.edited)&&(o.createElement("a").innerHTML="Edited");var p=o.createElement("p");p.innerHTML=t.date;var m=o.createElementNS("http://www.w3.org/2000/svg","svg");m.setAttribute("width","25px"),m.setAttribute("height","25px"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","none"),m.setAttribute("xmlns","http://www.w3.org/2000/svg"),m.classList.add("svg-container"),m.setAttribute("class","svg-fill");var v=o.createElementNS("http://www.w3.org/2000/svg","path");v.setAttribute("opacity","0.5"),v.setAttribute("d","M12.8324 21.8013C15.9583 21.1747 20 18.926 20 13.1112C20 7.8196 16.1267 4.29593 13.3415 2.67685C12.7235 2.31757 12 2.79006 12 3.50492V5.3334C12 6.77526 11.3938 9.40711 9.70932 10.5018C8.84932 11.0607 7.92052 10.2242 7.816 9.20388L7.73017 8.36604C7.6304 7.39203 6.63841 6.80075 5.85996 7.3946C4.46147 8.46144 3 10.3296 3 13.1112C3 20.2223 8.28889 22.0001 10.9333 22.0001C11.0871 22.0001 11.2488 21.9955 11.4171 21.9858C11.863 21.9296 11.4171 22.085 12.8324 21.8013Z"),v.setAttribute("fill","#0c2c67"),v.id="".concat(t.id,"_fill1"),v.setAttribute("class","path1");var h=o.createElementNS("http://www.w3.org/2000/svg","path");h.setAttribute("d","M8 18.4442C8 21.064 10.1113 21.8742 11.4171 21.9858C11.863 21.9296 11.4171 22.085 12.8324 21.8013C13.871 21.4343 15 20.4922 15 18.4442C15 17.1465 14.1814 16.3459 13.5401 15.9711C13.3439 15.8564 13.1161 16.0008 13.0985 16.2273C13.0429 16.9454 12.3534 17.5174 11.8836 16.9714C11.4685 16.4889 11.2941 15.784 11.2941 15.3331V14.7439C11.2941 14.3887 10.9365 14.1533 10.631 14.3346C9.49507 15.0085 8 16.3949 8 18.4442Z"),h.setAttribute("fill","#0c2c67"),h.id="".concat(t.id,"_fill2"),h.setAttribute("class","path2"),m.appendChild(v),m.appendChild(h),m.onclick=function(){var r=t.id;!function liked(t,o,r){var i="".concat(o,"_fill1"),a="".concat(o,"_fill2"),c=r.getElementById(i),d=r.getElementById(a);t.preventDefault(),fetch("like",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",r)},body:JSON.stringify({id:o})}).then((function(t){return t.json()})).then((function(t){if(t&&void 0!==t.likes){console.log(t),c?(console.log(c),t.isLiked?(c.setAttribute("fill","#2c29e2"),d.setAttribute("fill","#00BFFF")):(c.setAttribute("fill","#1E1E1E"),d.setAttribute("fill","#0c2c67"))):console.error("Path element not found:",pathId);var i="".concat(o,"_like"),a=r.getElementById(i);if(a){var l=t.likes;a.innerHTML=l}else console.error("Element not found:",o);console.log("Request successful")}else console.error("Request failed or response is unexpected")})).catch((function(t){console.error("Error:",t)}))}(event,r,o)},t.liked&&(v.setAttribute("fill","#2c29e2"),h.setAttribute("fill","#00BFFF"));var b=o.createElement("p");b.innerHTML=t.likes;var E="".concat(t.id,"_like");b.setAttribute("id",E),a.appendChild(c);var y=t.viewer===t.poster_id;if(y){var g=o.createElementNS("http://www.w3.org/2000/svg","svg");g.setAttribute("width","25px"),g.setAttribute("height","25px"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.setAttribute("xmlns","http://www.w3.org/2000/svg"),g.classList.add("svg-container"),g.classList.add("svg-fill");var C=o.createElementNS("http://www.w3.org/2000/svg","path");C.setAttribute("opacity","0.5"),C.setAttribute("d","M10 12V17"),C.setAttribute("stroke","red"),C.id="".concat(t.id,"_delete1"),C.classList.add("path1"),C.classList.add("path-danger");var w=o.createElementNS("http://www.w3.org/2000/svg","path");w.setAttribute("opacity","0.5"),w.setAttribute("d","M14 12V17"),w.setAttribute("stroke","red"),w.id="".concat(t.id,"_delete2"),w.classList.add("path2"),w.classList.add("path-danger");var A=o.createElementNS("http://www.w3.org/2000/svg","path");A.setAttribute("opacity","0.5"),A.setAttribute("d","M4 7H20"),A.setAttribute("stroke","red"),A.id="".concat(t.id,"_delete3"),A.classList.add("path3"),A.classList.add("path-danger");var L=o.createElementNS("http://www.w3.org/2000/svg","path");L.setAttribute("opacity","0.5"),L.setAttribute("d","M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"),L.setAttribute("stroke","red"),L.id="".concat(t.id,"_delete4"),L.classList.add("path4"),L.classList.add("path-danger");var k=o.createElementNS("http://www.w3.org/2000/svg","path");k.setAttribute("opacity","0.5"),k.setAttribute("d","M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"),k.setAttribute("stroke","red"),k.id="".concat(t.id,"_delete5"),k.classList.add("path5"),k.classList.add("path-danger"),g.appendChild(C),g.appendChild(w),g.appendChild(A),g.appendChild(L),g.appendChild(k),g.onclick=function(){var r=t.id;Swal.fire({title:"Are you sure to delete?",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete it!"}).then((function(t){t.isConfirmed&&function deleted(t,o,r){fetch("post/delete",{method:"DELETE",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",r)},body:JSON.stringify({id:o})}).then((function(t){if(t.ok){var i=r.getElementById("".concat(o,"_post"));i&&(i.style.transition="opacity 0.25s ease",i.style.opacity=0,setTimeout((function(){i.remove()}),200))}})).catch((function(t){console.error("Error:",t)}))}(event,r,o)}))};var T=o.createElement("a");T.innerHTML="Edit",T.setAttribute("id","".concat(t.id,"_edit")),T.setAttribute("class","text-primary"),T.addEventListener("mouseover",(function(){T.style.cursor="pointer"})),a.appendChild(T),T.onclick=function(){var r=t.id;!function Edit(t,o,r,i){t.preventDefault();var a="".concat(o,"_container");try{for(var c=i.getElementById(a),d=i.getElementById("".concat(r.id,"_posted"));c.firstChild;)c.firstChild.remove();var l=i.createElement("textarea");l.setAttribute("class","form-control commentInput"),l.setAttribute("id","".concat(o,"_content"));var u=i.createElement("button");u.setAttribute("id","".concat(o,"_edit")),u.setAttribute("class","btn btn-primary"),l.value=d.innerHTML,u.innerHTML="Edit",c.appendChild(l),c.appendChild(u),u.addEventListener("mouseover",(function(){u.style.cursor="pointer"})),u.disabled=!0,l.onkeyup=function(t){u.disabled=!1,u.onclick=function(a){u.disabled=!0;var l=t.target.value;fetch("edit",{method:"PUT",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",i)},body:JSON.stringify({id:o,content:l})}).then((function(t){t.ok?(c.innerHTML="",d.innerHTML=l,c.append(d),i.getElementById("".concat(r.id,"_post"))):console.error("Error updating content:",t.statusText)})).catch((function(t){console.error("Error:",t)}))},u.addEventListener("mouseover",(function(){u.style.cursor="pointer"}))}}catch(t){console.error("Error:",t)}}(event,r,t,o)}}a.appendChild(d);var _=o.createElement("div");_.setAttribute("class","comment-div"),_.setAttribute("id","comment_container");var M=o.createElement("p"),H=o.createElement("div");H.setAttribute("id","".concat(t.id,"_comment"));var B=o.createElement("div");H.setAttribute("id","".concat(t.id,"_Mcomment"));var I=o.createElement("div");M.innerHTML="comment",M.id="".concat(t.id,"_commentC"),I.appendChild(M);var S=o.createElement("div");S.setAttribute("id","".concat(t.id,"_comments"));var x=o.createElement("p");if(x.setAttribute("id","".concat(t.id,"_commentss")),x.innerHTML="comments",S.appendChild(x),_.appendChild(S),_.appendChild(B),_.appendChild(H),_.appendChild(I),M.addEventListener("mouseover",(function(){M.style.cursor="pointer"})),x.addEventListener("mouseover",(function(){x.style.cursor="pointer",r=0})),M.onclick=function(){var r=t.id;M.onclick=null,comment_(event,r,t,o)},x.onclick=function(){var r=t.id;commentsList(event,r,t,o)},t.edited){var N=o.createElement("a");N.innerHTML="Edited",a.appendChild(N)}var P=o.createElement("div");P.setAttribute("class","like-div"),P.appendChild(m),P.appendChild(b);var j=o.createElement("div");j.setAttribute("class","interaction-div"),j.appendChild(P),y&&j.appendChild(g);var O=o.createElement("div");O.setAttribute("class","container-info"),O.setAttribute("id","".concat(t.id,"_before")),O.appendChild(j),O.appendChild(p),a.appendChild(O),a.appendChild(_),i?o.querySelector("#posts").prepend(a):o.querySelector("#posts").append(a)}var i=0,a=0,c=0,d=10,l=!1,u="null";function load(){var t=i,o=t+10-1;i=o+1,document.getElementById("poster-h2").innerHTML="All posts",document.getElementById("post").addEventListener("input",(function(){var t=this.value.length;document.getElementById("wordCount").textContent=t+" / 200 Characters";var o=document.getElementById("postButton");t>200?(document.getElementById("wordCount").textContent="200 / 200 Characters please minimize the post",o.disabled=!0):o.disabled=!1})),fetch("/posts?start=".concat(t,"&end=").concat(o)).then((function(t){return t.json()})).then((function(t){t.posts&&Array.isArray(t.posts.posts)?t.posts.posts.forEach((function(t){add_post(t,document,c)})):console.error("Data.posts is not an array:",t.posts)}))}function profile(t,o,r){var i=a,p=i+d-1;a=p+1,r?(u="null",r=!1):u=o||"null",console.log("".concat(u," contentG and ").concat(o)),fetch("/profile?startP=".concat(i,"&endP=").concat(p,"&user=").concat(u)).then((function(t){return t.json()})).then((function(t){if(Array.isArray(t.posts.posts)){if(!l)document.getElementById("posts").innerHTML="",window.scrollTo(0,0);l=!0,t.posts.posts.forEach((function(o){console.log(t.posts),function profileStats(t){"null"===u&&(u=t.userProfile);var o=document.getElementById("index-div");o.innerHTML="";var r=document.getElementById("poster-h2");t.is_following?r.innerHTML="For you posts":r.innerHTML="".concat(t.userProfile," posts");var i=document.createElement("h1");i.innerHTML="".concat(t.userProfile);var a=document.createElement("div");if(a.id="user-follow",a.appendChild(i),t.user!==t.userProfile){var c=document.createElement("a");t.isfollowing?c.innerHTML=" - following":c.innerHTML=" - follow",c.setAttribute("id","".concat(t.userProfile,"_follow")),c.setAttribute("class","text-primary"),c.addEventListener("mouseover",(function(){c.style.cursor="pointer"})),a.appendChild(c),c.onclick=function(o){follow(o,t)}}var d=document.createElement("div");d.className="follow-stat";var l=document.createElement("p");l.innerHTML="Followers";var p=document.createElement("p");p.innerHTML="".concat(t.followers),p.id="".concat(t.userProfile,"_followers"),d.appendChild(l),d.appendChild(p);var m=document.createElement("div");m.className="follow-stat";var v=document.createElement("p");v.innerHTML="Following";var h=document.createElement("p");h.innerHTML="".concat(t.following),h.id="".concat(t.userProfile,"_following"),m.appendChild(v),m.appendChild(h),o.appendChild(a),o.appendChild(d),o.appendChild(m)}(t.posts),console.log(t.posts),add_post(o,document,c)}))}else console.error("Data.posts is not an array:",t.posts)}))}document.addEventListener("DOMContentLoaded",(function(){var t=document.getElementById("following"),o=document.getElementById("post"),r=document.getElementById("postButton");r.disabled=!0,o.onkeyup=function(){o.value.length>0?r.disabled=!1:r.disabled=!0,r.onclick=function(t){r.disabled=!0,function submitPost(t){t.preventDefault();var o=document.getElementById("postButton");o.disabled=!0;var r=document.getElementById("post-form"),i=new FormData(r).get("post");fetch("post",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken",document)},body:JSON.stringify({post:i})}).then((function(t){return t.json()})).then((function(t){t&&void 0!==t.data.post?(console.log("Request successful"),add_post(t.data,document,c,!0),o.disabled=!1):(console.log(t.post),console.error("Request failed or response is unexpected"))})).catch((function(t){console.error("Error:",t)}))}(t)}};var i=function followingClickHandler(o){o.preventDefault(),profile(o,"null",!0),t.addEventListener("click",followingClickHandler)};t.addEventListener("click",i),load();window.addEventListener("popstate",(function reattachFollowingListener(){t.removeEventListener("click",i),t.addEventListener("click",i)}))})),window.onscroll=function debounce(t,o){var r;return function(){var i=this,a=arguments;clearTimeout(r),r=setTimeout((function(){t.apply(i,a)}),o)}}((function(){window.innerHeight+window.scrollY>=document.body.offsetHeight&&(l?profile(event,u):load())}),300)})();