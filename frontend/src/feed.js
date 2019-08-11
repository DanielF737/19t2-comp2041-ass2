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
    } else {
        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            }
        }
        fetch(`${apiURL}/user/feed`, options)
            .then(r=> r.json())
            .then(r => {buildUser(r.posts)})
        }
}

function buildUser(posts) {
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
        upvoteImage.className="upvoteButton"
        upvote.append(upvoteImage)

        //If signed in check whether u have upvoted


        const upvoteCount = document.createElement("a")
        upvoteCount.textContent=items.meta.upvotes.length
        upvoteCount.addEventListener("click", function() {
            viewUpvotes(items.meta.upvotes)
        })
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

function viewUpvotes(upvotes) {
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        openModal()
        ShowLoginForm()
    } else {
        clearModal()
        openModal()
        const modal = document.getElementById("myModal");
        const modalHeader = document.getElementsByClassName("modal-header")
        const modalBody = document.getElementsByClassName("modal-body")

        const left = document.getElementsByClassName("left")
        const sideImage = document.createElement("img")
        sideImage.setAttribute("src", "images/loginImage.png")
        sideImage.id="sideImage"
        left[0].append(sideImage)

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
                },
                query: {"id":upvote}
            }

            fetch(`${apiURL}/user/`, options)
                .then(r => r.json())
                .then(r => {
                    upvText.textContent=r.username
                })
            
            upvNode.append(upvText)
            upvList.append(upvNode)
        }
    }
}

function viewComments(comments) {
    clearModal()
    openModal()
    const modal = document.getElementById("myModal");
    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")

    const left = document.getElementsByClassName("left")
    const sideImage = document.createElement("img")
    sideImage.setAttribute("src", "images/loginImage.png")
    sideImage.id="sideImage"
    left[0].append(sideImage)

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