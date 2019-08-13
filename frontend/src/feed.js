import {showPostForm} from './post.js'
import {clearModal, openModal, openBottomModal} from "./modal.js"
import {ShowLoginForm} from './loginForm.js'
import { showUserProfile } from './navbar.js';

function buildFeed() {
    const main = document.getElementById("main")
    
    const feed = document.createElement("ul")
    feed.id="feed"
    feed.setAttribute("data-id-feed", "")
    main.append(feed)

    const header = document.createElement("div")
    header.className="feed-header"
    feed.append(header)
    
    const title = document.createElement("select")
    title.className="feed-title alt-text"
    title.setAttribute("dir", "rtl")
    header.append(title)

    const op1 = document.createElement("option")
    op1.textContent="Popular posts "
    op1.addEventListener("click", function(){
        //Change to public feedconst 
        clearFeed()
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
    })
    
    title.append(op1)
    const op2 = document.createElement("option")
    op2.textContent="Your Timeline "
    op2.addEventListener("click", function(){
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
                fetch(`${apiURL}/user/feed?n=5`, options)
                    .then(r=> r.json())
                    .then(r => {buildUser(r.posts)})
                localStorage.setItem("numPosts", 5)
                let now = new Date()
                localStorage.setItem("lastCalled", now.getTime())
                title.selectedIndex=1 
            }
    })
    title.append(op2)
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        title.selectedIndex=0
    }else{
        title.selectedIndex=1
    }
    
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
        let now = new Date()
        localStorage.setItem("lastCalled", now.getTime())
    }
}

async function buildUser(posts) {
    if (posts.length===0) {
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
        const post = document.createElement("li")
        post.className="post"
        post.setAttribute("data-id-post", "")
        feed.append(post)

        const upvote = document.createElement("div")
        upvote.className="vote"
        upvote.setAttribute("data-id-upvotes", "")
        post.append(upvote)
        
        const upvoteImage = document.createElement("input")
        upvoteImage.type="image"
        upvoteImage.setAttribute("src", "images/upvoteDefault.png")
        const upvoteCount = document.createElement("a")
        upvoteCount.className="upvoteCount"
        upvoteCount.textContent=items.meta.upvotes.length
        upvoteImage.className="upvoteButton"
        upvoteCount.addEventListener("click", function() {
            viewUpvotes(items.id)
        })

        upvoteImage.addEventListener("mouseenter", function() {
            upvoteImage.src="images/upvoteDown.png"
        })

        upvoteImage.addEventListener("click", function() {
            postUpvote(items.id, upvoteImage, upvoteCount)
        })

        if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        } else {
            let userID = localStorage.getItem("userID")
            if (items.meta.upvotes.includes(parseInt(userID))) {
                upvoteImage.setAttribute("src", "images/upvotePressed.png")
            } else {
                upvoteImage.setAttribute("src", "images/upvoteDefault.png")
            }
            //Check if have upvoted
        
            upvoteImage.addEventListener("mouseleave", function() {
                const apiURL = localStorage.getItem("apiURL")
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
        upvote.append(upvoteImage)
        upvote.append(upvoteCount)

        const content = document.createElement("div")
        content.className="content"
        post.append(content)

        const sub = document.createElement("h3")
        sub.className="sub"
        sub.textContent= "/s/"+items.meta.subseddit
        content.append(sub)

        const heading = document.createElement("h4")
        heading.className="post-title alt-text inlineplz"
        heading.setAttribute("data-id-title", "")
        heading.textContent= items.title
        content.append(heading)

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
                fetch(`${apiURL}/user/?username=${items.meta.author}`, options)
                    .then(r => r.json())
                    .then(r => {
                        showUserProfile(r)
                    })
            }
        })

        const text1 = document.createTextNode("Posted by ")
        const text2 = document.createTextNode(` at ${hours}:${minutes} on ${day}/${month}/${year}`)
        author.append(text1)
        author.append(authorlink)
        author.append(text2)
        content.append(author)

        const postText = document.createElement("p")
        postText.textContent=items.text
        content.append(postText)
        
        if (items.image!=null) {
            const postImage = document.createElement("img")
            postImage.className="postImage"
            postImage.setAttribute("src", "data:image/png;base64," + items.image)
            content.append(postImage)
        }

        const viewComm = document.createElement("button")
        viewComm.style.marginTop="10px"
        viewComm.textContent="Comments (" + items.comments.length+")"
        viewComm.className="button button-primary"
        content.append(viewComm)
        viewComm.addEventListener("click", function() {
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
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

    const children = main.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }
    buildFeed()
}

function viewUpvotes(postID) {
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        openModal()
        ShowLoginForm()
    } else {
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

        fetch(`${apiURL}/post/?id=${postID}`, options)
            .then(r => r.json())
            .then(r => {
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
                    const disc = document.createElement("p")
                    disc.textContent="No upvotes to display"
                    disc.style.color="gray"
                    disc.style.paddingLeft ="30px"
                    //disc.style.textAlign="center"
                    upvList.append(disc)
                } else {
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
    clearModal()
    openModal()

    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")

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
        const disc = document.createElement("p")
        disc.textContent="No comments to display"
        disc.style.color="gray"
        disc.style.paddingLeft ="60px"
        commList.append(disc)
    } else {
        for (const comment of comments) {
            const commNode = document.createElement("li")
            const commText = document.createElement("p")
            commText.textContent=comment.comment
            
            commNode.append(commText)
            commList.append(commNode)
        }
    }

    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {return}
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

    postBtn.addEventListener("click", function(e){
        e.preventDefault()
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

        fetch(`${apiURL}/post/comment?id=${postID}`, options)

        if (totalComms===0) {
            const children = commList.children
            while(children.length > 0){
                children[0].parentNode.removeChild(children[0]);
            }
        }

        totalComms+=1
        passBtn.textContent="Comments (" + totalComms +")"

        const commNode = document.createElement("li")
        const commText = document.createElement("p")
        commText.textContent=commIn.value
        
        commNode.append(commText)
        commList.append(commNode)

        commIn.value=""
    })

}

function postUpvote(postID, button, count) {
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
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
        
        fetch(`${apiURL}/post/?id=${postID}`, options)
            .then(r => r.json())
            .then(r => {
                if (r.meta.upvotes.includes(parseInt(userID))) {
                    //rm them from the list (delete post/vote req)
                    options = {
                        method: "DELETE",
                        headers: {
                            'Content-Type' : 'application/JSON',
                            "Authorization" : "Token " + localStorage.getItem("Token")
                        }
                    }
                    fetch(`${apiURL}/post/vote/?id=${postID}`, options)

                    count.textContent=parseInt(count.textContent)-1
                    button.src="images/upvoteDefault.png"
                } else {
                    //add them to the list (put post/vote req)
                    options = {
                        method: "PUT",
                        headers: {
                            'Content-Type' : 'application/JSON',
                            "Authorization" : "Token " + localStorage.getItem("Token")
                        }
                    }
                    fetch(`${apiURL}/post/vote/?id=${postID}`, options)

                    count.textContent=parseInt(count.textContent)+1
                    button.src="images/upvotePressed.png"
                }
            })
    }
}

function infiniteScroll() {
    window.addEventListener("scroll", function() {
        let feed = document.getElementById("feed")
        let windowHeight = window.pageYOffset
        let total = windowHeight+ window.innerHeight
        if (total >= feed.offsetHeight) {
            //If logged in add more
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined"|| localStorage.getItem("numPosts") < 0) {
                return
            } else {
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
    let current = localStorage.getItem("numPosts")
    if (current < 0) {return}

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