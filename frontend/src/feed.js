function buildFeed() {
    const main = document.getElementById("main")
    
    const feed = document.createElement("ul")
    feed.id="feed"
    feed.setAttribute("data-id-feed", "")
    main.append(feed)

    const header = document.createElement("div")
    header.className="feed-header"
    feed.append(header)
    const title = document.createElement("h3")
    title.className="feed-title alt-text"
    title.textContent="Popular posts"
    header.append(title)
    postButton = document.createElement("button")
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
            .then(r => {buildUser(r.posts)})
        localStorage.setItem("numPosts", -1)
    } else {
        title.textContent="Your Timeline"
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
        }
        localStorage.setItem("numPosts", 5)
        let now = new Date()
        localStorage.setItem("lastCalled", now.getTime())
}

async function buildUser(posts) {
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
        let userID = localStorage.getItem("userID")
        if (items.meta.upvotes.includes(parseInt(userID))) {
            upvoteImage.setAttribute("src", "images/upvotePressed.png")
        } else {
            upvoteImage.setAttribute("src", "images/upvoteDefault.png")
        }
        //Check if have upvoted
        upvoteImage.className="upvoteButton"

        const upvoteCount = document.createElement("a")
        upvoteCount.className="upvoteCount"
        upvoteCount.textContent=items.meta.upvotes.length
        upvoteCount.addEventListener("click", function() {
            viewUpvotes(items.id)
        })

        upvoteImage.addEventListener("mouseenter", function() {
            upvoteImage.src="images/upvoteDown.png"
        })
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

        upvoteImage.addEventListener("click", function() {
            postUpvote(items.id, upvoteImage, upvoteCount)
        })
        upvote.append(upvoteImage)
        upvote.append(upvoteCount)

        const content = document.createElement("div")
        content.className="content"
        post.append(content)

        const sub = document.createElement("h3")
        sub.textContent= "/s/"+items.meta.subseddit
        content.append(sub)

        const heading = document.createElement("h4")
        heading.className="post-title alt-text"
        heading.setAttribute("data-id-title", "")
        heading.textContent= items.title
        content.append(heading)

        const author = document.createElement("p")
        author.className="post-author"
        author.setAttribute("data-id-author", "")
        let date = new Date(items.meta.published * 1000)
        author.textContent="Posted by @" + items.meta.author + " at " + date
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
        viewComm.textContent="Comments (" + items.comments.length+")"
        content.append(viewComm)
        viewComm.addEventListener("click", function() {
            viewComments(items.comments)
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
            //.then(r => {console.log(r.status); return r})
            .then(r => r.json())
            .then(r => {
                const upvotes=r.meta.upvotes
                const modal = document.getElementById("myModal");
                const modalHeader = document.getElementsByClassName("modal-header")
                const modalBody = document.getElementsByClassName("modal-body")

                const title = document.createElement("h2")
                title.textContent="Upvotes"
                modalHeader[0].append(title)

                const upvWrap = document.createElement("div")
                upvWrap.className="upvWrap"
                modalBody[0].append(upvWrap)

                const upvList = document.createElement("ul")
                upvWrap.append(upvList)
                upvList.className="upvList"

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
            })
    }
}

function viewComments(comments) {
    clearModal()
    openModal()
    const modal = document.getElementById("myModal");
    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")

    const title = document.createElement("h2")
    title.textContent="Comments"
    modalHeader[0].append(title)

    const commWrap = document.createElement("div")
    commWrap.className="commWrap"
    modalBody[0].append(commWrap)

    const commList = document.createElement("ul")
    commWrap.append(commList)
    commList.className="commList"

    for (const comment of comments) {
        const commNode = document.createElement("li")
        const commText = document.createElement("p")
        commText.textContent=comment.comment
        
        commNode.append(commText)
        commList.append(commNode)
    }

}

function postUpvote(postID, button, count) {
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        openModal()
        ShowLoginForm()
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
        //let upvoteState=0

        console.log(`user id = ${userID}`)
        fetch(`${apiURL}/post/?id=${postID}`, options)
            //.then(r => {console.log(r.status); return r})
            .then(r => r.json())
            .then(r => {
                console.log(r.meta.upvotes.includes(parseInt(userID)))
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
                    .then(r => {console.log(`delete status ${r.status}`); return r})

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
                    .then(r => {console.log(`add status ${r.status}`); return r})

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
            if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
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
    console.log(current)
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
    console.log(`${apiURL}/user/feed?p=${p}&n=${n}`)
    fetch(`${apiURL}/user/feed?p=${p}&n=${n}`, options)
        .then(r=> r.json())
        .then(r => {
            console.log(r.posts)
            buildUser(r.posts)
        })
    

}