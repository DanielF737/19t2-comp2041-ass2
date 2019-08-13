import {showPostForm} from './post.js'
import {clearModal, openModal, openBottomModal} from "./modal.js"
import {ShowLoginForm} from './loginForm.js'
import { showUserProfile } from './navbar.js';

function buildFeed() {
    const main = document.getElementById("main")
    
    //Create the feed unordered List and append it to main
    const feed = document.createElement("ul")
    feed.id="feed"
    feed.setAttribute("data-id-feed", "")
    main.append(feed)

    //Create the header div
    const header = document.createElement("div")
    header.className="feed-header"
    feed.append(header)
    
    //Create the title dropdown, add an event listener that determines which feed to display
    const title = document.createElement("select")
    title.className="feed-title alt-text"
    title.setAttribute("dir", "rtl")
    header.append(title)

    const op1 = document.createElement("option")
    op1.textContent="Popular posts "
    
    title.append(op1)
    const op2 = document.createElement("option")
    op2.textContent="Your Timeline "

    title.append(op2)
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        title.selectedIndex=0
    }else{
        title.selectedIndex=1
    }

    title.addEventListener("change", function(){
        if (title.selectedIndex===0) {
            //Change to public feed 
            clearFeed()
            const apiURL = localStorage.getItem("apiURL")
            let options = {
                method: "GET",
                headers: {
                    'Content-Type' : 'application/JSON'
                }

            }
            //Make a fetch request for the public posts and build the feed
            fetch(`${apiURL}/post/public`, options)
                .then(r=> r.json())
                .then(r => {
                    buildUser(r.posts)
                })
            localStorage.setItem("numPosts", -1)
        } else {
            //Change to other feed if logged in
            //Rebuild feed, set this dropdown to the right text, show user feed
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
                title.selectedIndex=0 
                openModal()
                ShowLoginForm()
            } else {
                clearFeed()
                const apiURL = localStorage.getItem("apiURL")
                let options = {
                    method: "GET",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        "Authorization" : "Token " + localStorage.getItem("Token")
                    }
                }
                //Make a fetch request for the first 5 elements in the user feed
                fetch(`${apiURL}/user/feed?n=5`, options)
                    .then(r=> r.json())
                    .then(r => {buildUser(r.posts)})
                localStorage.setItem("numPosts", 5)
                let now = new Date()
                localStorage.setItem("lastCalled", now.getTime())
                title.selectedIndex=1 
            }
        }
    })

    
    //Create the post button, and give it an event listener that opens the post form if
    //the user is logged in, or the login form if they are not
    const postButton = document.createElement("button")
    postButton.textContent = "Post"
    postButton.className = "button - button-secondary"
    postButton.addEventListener("click", function() {
        if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
            openModal()
            ShowLoginForm()
        } else {
            openBottomModal()
            showPostForm()
        }
    })
    header.append(postButton)

    //If the user is logged in, grab the public feed and build the timeline, else grab the first 5 elements of
    //The users feed and build the timeline
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON'
            }

        }
        fetch(`${apiURL}/post/public`, options)
            .then(r=> r.json())
            .then(r => {
                buildUser(r.posts)
            })
        localStorage.setItem("numPosts", -1)
    } else {
        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            }
        }
        fetch(`${apiURL}/user/feed?n=5`, options)
            .then(r=> r.json())
            .then(r => {buildUser(r.posts)})
        localStorage.setItem("numPosts", 5)
        //Set the last time new posts were fetched so the infinite scroll isnt overloaded
        let now = new Date()
        localStorage.setItem("lastCalled", now.getTime())
    }
}

async function buildUser(posts) {
    if (posts.length===0) {
        //If there are no items in the feed/no items remaining to show from infinite scroll, show
        //an apropriate message
        const feedC = document.getElementsByClassName("noPost")
        if(feedC.length > 0){return}
        const post = document.createElement("p")
        post.className="noPost"
        post.textContent="No more posts to display"
        post.style.color="gray"
        post.style.textAlign="center"
        post.style.paddingTop="80px"
        feed.append(post)
    }
    for (const items of posts) {
        //Create a post list element
        const post = document.createElement("li")
        post.className="post"
        post.setAttribute("data-id-post", "")
        feed.append(post)

        //Make the upvote div
        const upvote = document.createElement("div")
        upvote.className="vote"
        upvote.setAttribute("data-id-upvotes", "")
        post.append(upvote)
        
        //Create the upvote image and counter and set them based on their values
        const upvoteImage = document.createElement("input")
        upvoteImage.type="image"
        upvoteImage.setAttribute("src", "images/upvoteDefault.png")
        const upvoteCount = document.createElement("a")
        upvoteCount.className="upvoteCount"
        upvoteCount.textContent=items.meta.upvotes.length
        upvoteImage.className="upvoteButton"
        //Set the event listener on the upvote count to open the view upvote form
        upvoteCount.addEventListener("click", function() {
            viewUpvotes(items.id)
        })

        //Set up the mouse enter event listener on the upvote button to change the image
        upvoteImage.addEventListener("mouseenter", function() {
            upvoteImage.src="images/upvoteDown.png"
        })

        //Add an event listener to post an upvote when the button is clicked
        upvoteImage.addEventListener("click", function() {
            postUpvote(items.id, upvoteImage, upvoteCount)
        })

        if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
            //Add an event listener to return the upvote image to the correct state when
            //the mouse stops hovering
            upvoteImage.addEventListener("mouseleave", function() {upvoteImage.src="images/upvoteDefault.png"})
        } else {
            //Check if have upvoted by grabbing the most up to date post data, and then 
            //set the upvote image to the correct state
            upvoteImage.addEventListener("mouseleave", function() {
                const apiURL = localStorage.getItem("apiURL")
                const userID = localStorage.getItem("userID")
                let postID=items.id
                let options = {
                    method: "GET",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        "Authorization" : "Token " + localStorage.getItem("Token")
                    }
                }
                fetch(`${apiURL}/post/?id=${postID}`, options)
                    .then(r => r.json())
                    .then(r => {
                        if (r.meta.upvotes.includes(parseInt(userID))) {
                            upvoteImage.setAttribute("src", "images/upvotePressed.png")
                        } else {
                            upvoteImage.setAttribute("src", "images/upvoteDefault.png")
                        }
                    })
            })

        }
        //Append the upvote objects
        upvote.append(upvoteImage)
        upvote.append(upvoteCount)

        //Create the wrapper for where the post content is stored
        const content = document.createElement("div")
        content.className="content"
        post.append(content)

        //Create the header object for the subseddit name and append
        const sub = document.createElement("h3")
        sub.className="sub"
        sub.textContent= "/s/"+items.meta.subseddit
        content.append(sub)

        //Create the header object for the post title and append
        const heading = document.createElement("h4")
        heading.className="post-title alt-text inlineplz"
        heading.setAttribute("data-id-title", "")
        heading.textContent= items.title
        content.append(heading)

        //Create the object for the post author and post date, format the date
        //correctly and add an event listener to the author name to show the author's profile
        const author = document.createElement("p")
        author.className="post-author inlineplz"
        author.setAttribute("data-id-author", "")
        let date = new Date(items.meta.published * 1000)
        let hours=date.getHours()
        let minutes=date.getMinutes()
        let day=date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear().toString().substr(-2)
        const authorlink = document.createElement("a")
        authorlink.textContent="@"+items.meta.author
        authorlink.className="upvoteCount"
        authorlink.addEventListener("click", function(){
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
                openModal()
                ShowLoginForm()
            } else {
                const apiURL = localStorage.getItem("apiURL")
                let options = {
                    method: "GET",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        "Authorization" : "Token " + localStorage.getItem("Token")
                    }
                }
                //Fetch the most up to date version of the user profile to display
                fetch(`${apiURL}/user/?username=${items.meta.author}`, options)
                    .then(r => r.json())
                    .then(r => {
                        showUserProfile(r)
                    })
            }
        })
        //Format and append the author and time data
        const text1 = document.createTextNode("Posted by ")
        const text2 = document.createTextNode(` at ${hours}:${minutes} on ${day}/${month}/${year}`)
        author.append(text1)
        author.append(authorlink)
        author.append(text2)
        content.append(author)

        //Create elements for the post text and append
        const postText = document.createElement("p")
        postText.textContent=items.text
        postText.class="postText"
        content.append(postText)
        
        //If the post has an image, create an image object and add it to the form
        //followed by a line break for formatting
        if (items.image!=null) {
            const postImage = document.createElement("img")
            postImage.className="imagePost"
            postImage.setAttribute("src", "data:image/png;base64," + items.image)

            const lineBr = document.createElement("br")

            content.append(postImage)
            content.append(lineBr)
        }

        //Add a view comments button, update the button text based on the number of comments
        //on the post, then add an event listener to display the posts comments
        const viewComm = document.createElement("button")
        viewComm.style.marginTop="10px"
        viewComm.textContent="Comments (" + items.comments.length+")"
        viewComm.className="button button-primary"
        content.append(viewComm)
        viewComm.addEventListener("click", function() {
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
                //If they arent logged in show the login form
                viewComments(items.comments, items.id, viewComm, items.comments.length)
                return
            }

            const apiURL = localStorage.getItem("apiURL")
            let options = {
                method: "GET",
                headers: {
                    'Content-Type' : 'application/JSON',
                    "Authorization" : "Token " + localStorage.getItem("Token")
                }
            }
            //Otherwise grab the most recent comment data and display it
            fetch(`${apiURL}/post/?id=${items.id}`, options)
                .then(r => r.json())
                .then(r => {
                    viewComments(r.comments, r.id, viewComm, items.comments.length)
                })
        })
    }
}

function rebuildFeed() {
    const main = document.getElementById("main")
    //Delete all children from the feed then recreate it based on the most up to date data
    const children = main.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }
    buildFeed()
}

function viewUpvotes(postID) {
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        //If the user isnt logged in show the login form
        openModal()
        ShowLoginForm()
    } else {
        //Open the modal
        clearModal()
        openModal()
        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            }
        }
        //Fetch the most recent upvote data
        fetch(`${apiURL}/post/?id=${postID}`, options)
            .then(r => r.json())
            .then(r => {
                //Build the upvote form
                const upvotes=r.meta.upvotes
                const modal = document.getElementById("myModal");
                const modalHeader = document.getElementsByClassName("modal-header")
                const modalBody = document.getElementsByClassName("modal-body")

                const image = document.getElementById("sideImage")
                image.src="images/upvoteImage.png"

                const title = document.createElement("h2")
                title.textContent="Upvotes"
                modalHeader[0].append(title)

                const upvWrap = document.createElement("div")
                upvWrap.className="upvWrap"
                modalBody[0].append(upvWrap)

                const upvList = document.createElement("ul")
                upvWrap.append(upvList)
                upvList.className="upvList"

                if (upvotes.length===0 ) {
                    //If there are no upvotes display an apropriate message
                    const disc = document.createElement("p")
                    disc.textContent="No upvotes to display"
                    disc.style.color="gray"
                    disc.style.paddingLeft ="30px"
                    upvList.append(disc)
                } else {
                    //Otherwise loop through the upvotes, fetch the users username based on
                    //The user id and add it to the list
                    for (const upvote of upvotes) {
                        const upvNode = document.createElement("li")
                        const upvText = document.createElement("p")

                        const apiURL = localStorage.getItem("apiURL")
                        let options = {
                            method: "GET",
                            headers: {
                                'Content-Type' : 'application/JSON',
                                "Authorization" : "Token " + localStorage.getItem("Token")
                            }
                        }

                        fetch(`${apiURL}/user/?id=${upvote}`, options)
                            .then(r => r.json())
                            .then(r => {
                                upvText.textContent=r.username
                            })
                        
                        upvNode.append(upvText)
                        upvList.append(upvNode)
                    }
                }
            })
    }
}

function viewComments(comments, postID, passBtn, totalComms) {
    //Open the modal
    clearModal()
    openModal()

    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")

    //Build the comments form
    const image = document.getElementById("sideImage")
    image.src="images/commentImage.png"

    const title = document.createElement("h2")
    title.textContent="Comments"
    modalHeader[0].append(title)

    const commWrap = document.createElement("div")
    commWrap.className="commWrap"
    modalBody[0].append(commWrap)

    const commList = document.createElement("ul")
    commWrap.append(commList)
    commList.className="commList"

    if (comments.length===0 ) {
        //If there are no comments display an apropriate message
        const disc = document.createElement("p")
        disc.textContent="No comments to display"
        disc.style.color="gray"
        disc.style.paddingLeft ="60px"
        commList.append(disc)
    } else {
        //Otherwise loop through the comments and display them
        for (const comment of comments) {
            const commNode = document.createElement("li")
            const commText = document.createElement("p")
            commText.textContent=comment.comment
            
            commNode.append(commText)
            commList.append(commNode)
        }
    }

    //If the user is not logged in exit the function
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {return}

    //Otherwise build the post comment form
    const commForm = document.createElement("form")
    commForm.id="commForm"
    const commIn = document.createElement("textarea")
    commIn.className="commTextArea"
    commIn.setAttribute("placeholder", "Write your comment here...")
    const postBtn = document.createElement("button")
    postBtn.className="button button-secondary"
    postBtn.textContent="Post Comment"

    commForm.append(commIn)
    commForm.append(postBtn)

    modalBody[0].append(commForm)

    //Add an event listener to post a comment
    postBtn.addEventListener("click", function(e){
        e.preventDefault()
        //If the comment text input is empty exit the function
        if (commIn.value===""){return}
        const data = {comment : commIn.value} 

        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            },
            body: JSON.stringify(data)
        }
        //Make a put request for the comment
        fetch(`${apiURL}/post/comment?id=${postID}`, options)

        //If there are no previous comments, remove all children of
        //the comment form (remove the no comments message)
        if (totalComms===0) {
            const children = commList.children
            while(children.length > 0){
                children[0].parentNode.removeChild(children[0]);
            }
        }

        //Increment the total comments for the post counter and
        //update the view comments button apropriately
        totalComms+=1
        passBtn.textContent="Comments (" + totalComms +")"

        //add the new comment to the form
        const commNode = document.createElement("li")
        const commText = document.createElement("p")
        commText.textContent=commIn.value
        
        commNode.append(commText)
        commList.append(commNode)

        //Reset the text input
        commIn.value=""
    })

}

function postUpvote(postID, button, count) {
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        //If the user isnt logged in redirect them to login
        openModal()
        ShowLoginForm()
        button.src="images/upvoteDefault.png"
    } else {
        //Check to see upvote state of user on post
        const userID = localStorage.getItem("userID")
        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            }
        }
        //Fetch the post to see if the user has upvoted
        fetch(`${apiURL}/post/?id=${postID}`, options)
            .then(r => r.json())
            .then(r => {
                if (r.meta.upvotes.includes(parseInt(userID))) {
                    //If the user has upvoted the post:
                    //rm them from the list (delete post/vote req)
                    options = {
                        method: "DELETE",
                        headers: {
                            'Content-Type' : 'application/JSON',
                            "Authorization" : "Token " + localStorage.getItem("Token")
                        }
                    }                    //Make the delete request

                    fetch(`${apiURL}/post/vote/?id=${postID}`, options)
                    //decrement the upvote counter and set the button state
                    count.textContent=parseInt(count.textContent)-1
                    button.src="images/upvoteDefault.png"
                } else {
                    //If the user hasnt upvoted the post:
                    //add them to the list (put post/vote req)
                    options = {
                        method: "PUT",
                        headers: {
                            'Content-Type' : 'application/JSON',
                            "Authorization" : "Token " + localStorage.getItem("Token")
                        }
                    }
                    //Make the PUT request
                    fetch(`${apiURL}/post/vote/?id=${postID}`, options)
                    //increment the upvote counter and update the button state
                    count.textContent=parseInt(count.textContent)+1
                    button.src="images/upvotePressed.png"
                }
            })
    }
}

function infiniteScroll() {
    //Add an event listener to the window
    window.addEventListener("scroll", function() {
        let feed = document.getElementById("feed")
        let windowHeight = window.pageYOffset
        let total = windowHeight+ window.innerHeight
        //If the scrolled ammount is greater than the height of the feed
        if (total >= feed.offsetHeight) {
            //If the user isnt logged in, or if they are viewing the public feed
            //Where numposts is set to -1, 
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined"|| localStorage.getItem("numPosts") < 0) {
                return
            } else {
                //If logged in, and a request hasnt been made in 1500 milliseconds
                //(1.5) seconds add more posts
                let now = new Date()
                if (now.getTime() > parseInt(localStorage.getItem("lastCalled"))+1500) {
                    addPosts()
                    localStorage.setItem("lastCalled", now.getTime())
                }
            }
        }
    })
}

function addPosts() {
    //If we are on the public feed exit early
    let current = localStorage.getItem("numPosts")
    if (current < 0) {return}

    //Get the next 5 posts, and append them to the end of the feed
    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            "Authorization" : "Token " + localStorage.getItem("Token")
        }
    }
    let p = parseInt(current)
    localStorage.setItem("numPosts", p+5)
    let n = 5
    fetch(`${apiURL}/user/feed?p=${p}&n=${n}`, options)
        .then(r=> r.json())
        .then(r => {
            buildUser(r.posts)
        })
    

}

function clearFeed() {
    //Loop through all the feeds post/warning children and delete them
    let feed = document.getElementsByClassName("post")
    while(feed.length > 0){
        feed[0].parentNode.removeChild(feed[0]);
    }
    
    feed = document.getElementsByClassName("noPost")
    while(feed.length > 0){
        feed[0].parentNode.removeChild(feed[0]);
    }
}

export {buildFeed,buildUser, rebuildFeed, viewUpvotes, viewComments, postUpvote, infiniteScroll, addPosts}