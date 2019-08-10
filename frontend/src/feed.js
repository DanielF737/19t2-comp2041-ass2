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

    for (let i = 0; i < 7; i++) {
        const post = document.createElement("li")
        post.className="post"
        post.setAttribute("data-id-post", "")
        feed.append(post)

        const upvote = document.createElement("div")
        upvote.className="vote"
        upvote.setAttribute("data-id-upvotes", "")
        post.append(upvote)

        const content = document.createElement("div")
        content.className="content"
        post.append(content)

        const heading = document.createElement("h4")
        heading.className="post-title alt-text"
        heading.setAttribute("data-id-title", "")
        heading.textContent="Avenger’s Endgame Officially Passes Avatar To Become The\nHighest Grossing Movie Of All Time"
        content.append(heading)

        const author = document.createElement("p")
        author.className="post-author"
        author.setAttribute("data-id-author", "")
        author.textContent="Posted by @some_dude69"
        content.append(author)

    }
}