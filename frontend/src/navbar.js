import {clearModal, openModal, clearBottomModal, openBottomModal, closeBottomModal, closeModal} from "./modal.js"
import {ShowLoginForm, ShowRegisterForm, signOut} from './loginForm.js'
import {viewUpvotes, viewComments, postUpvote} from './feed.js'

function buildNavBar() {
    const root = document.getElementById("root")
    const modal = document.getElementById("myModal")
    const nav = document.getElementById("nav")

    //Build the seddit logo
    const logo = document.createElement("h1")
    logo.className="flex-center"
    logo.textContent="Seddit"
    logo.id="logo"
    nav.append(logo)

    //Create a list element to store the navigation elements
    const navList = document.createElement("ul")
    navList.className="nav"
    nav.append(navList)
    const li1 = document.createElement("li")
    li1.className="nav-item"

    //Build the search bar
    const search = document.createElement("input")
    search.setAttribute("data-id-search", "")
    search.setAttribute("placeholder", "Search Seddit")
    search.setAttribute("type", "search")
    search.id="search"

    li1.append(search)
    navList.append(li1)
    
    //Context sensetive navigation buttons dependant on whether the user is logged in
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        //If the user is logged in show a sign in and sign up button
        const li2 = document.createElement("li")
        li2.className="nav-item"
        const login = document.createElement("button")
        login.textContent="Log In"
        login.className="button button-primary"
        login.setAttribute("data-id-login", "")
        li2.append(login)
        navList.append(li2)
        //Adds an event listener to the login button to show the login form
        login.addEventListener("click", function() {
            modal.style.display = "block"
            ShowLoginForm()
        })

        const li3 = document.createElement("li")
        li3.className="nav-item"
        const signup = document.createElement("button")
        signup.className="button button-secondary"
        signup.setAttribute("data-id-signup", "")
        signup.textContent="Sign Up"
        li3.append(signup)
        navList.append(li3)
        //Adds an event listener to the register button to show the register form
        signup.addEventListener("click", function() {
            modal.style.display = "block"
            ShowRegisterForm()
        })
    } else {
        //If the user is logged in show a personalised greeting with a link to the user
        //profile and a sign out button
        const li2 = document.createElement("li")
        li2.className="nav-item"
        const greeting = document.createElement("p")
        greeting.id="greeting"
        greeting.textContent="Welcome, "
        const profileLink = document.createElement("a")
        profileLink.className="upvoteCount"

        //Make an API call to get current user data from the API
        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            }
        }
        fetch(`${apiURL}/user/`, options)
            .then(r => r.json())
            .then(r => {profileLink.textContent=r.username})

        //add an event listener to the profile link in the greeting to view the current
        //users profile
        profileLink.addEventListener("click", function() {
            const apiURL = localStorage.getItem("apiURL")
            let options = {
                method: "GET",
                headers: {
                    'Content-Type' : 'application/JSON',
                    "Authorization" : "Token " + localStorage.getItem("Token")
                }
            }
            fetch(`${apiURL}/user/`, options)
                .then(r => r.json())
                .then(r => {
                    showUserProfile(r)
                })
        })

        greeting.append(profileLink)
        li2.append(greeting)
        navList.append(li2)
        
        //Build the sign out button, add an event listener to sign the user
        //out
        const li3 = document.createElement("li")
        li3.className="nav-item"
        const login = document.createElement("button")
        login.textContent="Sign Out"
        login.className="button button-primary"
        li3.append(login)
        navList.append(li3)
        login.addEventListener("click", function() {
            signOut()
        })
    }
}

async function showUserProfile(user) {
    //Open the correct modal
    clearBottomModal()
    openBottomModal()
    
    const modalHeader = document.getElementsByClassName("bottom-modal-header")
    const modalBody = document.getElementsByClassName("bottom-modal-body")
    
    const br = document.createElement("br")
    const title=document.createElement("h2")
    title.textContent=user.username
    title.style.display="inline"
    modalHeader[0].append(br)
    modalHeader[0].append(title)

    //Create the wrappers for the profile content
    const top = document.createElement("div")
    top.id="top"
    const topLeft = document.createElement("div")
    topLeft.id="topLeft"
    const topMid = document.createElement("div")
    topMid.id="topMid"
    const topRight = document.createElement("div")
    topRight.id="topRight"
    const bottom = document.createElement("div")
    bottom.id = "bottom"

    const br1 = document.createElement("br")

    modalBody[0].append(top)
    modalBody[0].append(bottom)
    modalBody[0].append(br1)
    top.append(topLeft)
    top.append(topMid)
    top.append(topRight)

    //Grab all the information out of the user content and build the
    //DOM objects
    const name = document.createElement("p")
    name.textContent="Name: " + user.name
    const email = document.createElement("p")
    email.textContent = "Email: " + user.email
    const followers = document.createElement("p")
    followers.textContent = user.followed_num
    followers.id="followerCount"
    const followerLabel = document.createElement("p")
    followerLabel.textContent="Followers"
    const following = document.createElement("p")
    following.textContent = user.following.length
    const followingLabel = document.createElement("a")
    followingLabel.textContent="Following"
    followingLabel.className="upvoteCount"
    followingLabel.addEventListener("click", function(){
        //Add an event listener to open a modal that shows a list of
        //everyone the user follows
        clearModal()
        openModal()
        
        const modalHeader = document.getElementsByClassName("modal-header")
        const modalBody = document.getElementsByClassName("modal-body")

        const title = document.createElement("h2")
        title.textContent=user.username + "'s Following"
        modalHeader[0].append(title)

        //Use the upvote list class because its exactly what we need
        const upvWrap = document.createElement("div")
        upvWrap.className="upvWrap"
        modalBody[0].append(upvWrap)

        const upvList = document.createElement("ul")
        upvWrap.append(upvList)
        upvList.className="upvList"
        if (user.following.length===0 ) {
            //If there are no followed user display an apropriate message
            const disc = document.createElement("p")
            disc.textContent="No users to display"
            disc.style.color="gray"
            disc.style.paddingLeft ="30px"
            upvList.append(disc)
        } else {
            //Otherwise loop through the followed, fetch the users username based on
            //The user id and add it to the list
            for (const users of user.following) {
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
                fetch(`${apiURL}/user/?id=${users}`, options)
                    .then(r => r.json())
                    .then(r => {
                        upvText.textContent=r.username
                    })
                
                upvNode.append(upvText)
                upvList.append(upvNode)
            }
        }

    })
    const posts = document.createElement("p")
    posts.textContent = "Posts: " + user.posts.length
    const upvotes = document.createElement("p")
    const usrFeed = document.createElement("ul")
    usrFeed.id="usrFeed"
    const followButton = document.createElement("button")
    //Add an event listener to the button to follow the user 
    followButton.addEventListener("click", function(){followUser(user)})
    followButton.className="button button-secondary"
    followButton.id="followButton"
    followButton.textContent="Follow"    
    followButton.style.display="inline"
    followButton.style.float="right"
    
    if (user.posts.length > 0) {
        //If the user has posts, create a feed element in the profile and for
        //each post of theirs append it to that feed
        localStorage.setItem("Upvotes", 0)
        for (let post of user.posts) {
            const apiURL = localStorage.getItem("apiURL")
            let options = {
                method: "GET",
                headers: {
                    'Content-Type' : 'application/JSON',
                    "Authorization" : "Token " + localStorage.getItem("Token")
                }
            }
            fetch(`${apiURL}/post/?id=${post}`, options)
            .then(r => r.json())
            .then(r => {
                let newupvotes=parseInt(localStorage.getItem("Upvotes"))+r.meta.upvotes.length
                localStorage.setItem("Upvotes", newupvotes)
                //Increment the upvote counter
                upvotes.textContent="Upvotes: " + localStorage.getItem("Upvotes")
                usrFeedBuild(r)
            })
        }
    } else {
        //Otherwise set the upvote counter to be 0
        upvotes.textContent="Upvotes: 0"
    }


    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            "Authorization" : "Token " + localStorage.getItem("Token")
        }
    }
    //Make an API call to see if the current user is the same as the user
    //whose profile is being viewed
    fetch(`${apiURL}/user/`, options)
        .then(r => r.json())
        .then(r => {
            if (user.id===r.id) {
                //If they are the same user, replace the follow button with the edit profile button
                const editProfile = document.createElement("button")
                editProfile.id="editProfBtn"
                editProfile.addEventListener("click", function(){editUserProfile(user)})
                editProfile.className="button button-primary"
                editProfile.textContent="Edit Profile"    
                editProfile.style.display="inline"
                editProfile.style.float="right"
                modalHeader[0].append(editProfile)
                return
            }
            //Otherwise test to see if the user already follows the user whose profile
            //is being displayed and update the follow button accordingly
            if (r.following.includes(user.id)) {
                followButton.className="button button-primary"
                followButton.textContent="Unfollow"    
            }
            modalHeader[0].append(followButton)
        })
    
    //Append all the elements to their correct wrapper
    topLeft.append(name)
    topLeft.append(email)
    topMid.append(followers)
    topMid.append(followerLabel)
    topRight.append(following)
    topRight.append(followingLabel)
    bottom.append(posts)
    bottom.append(upvotes)
    modalBody[0].append(usrFeed)
}

function followUser(user) {
    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            "Authorization" : "Token " + localStorage.getItem("Token")
        }
    }
    //Grab the id of the current user and test whether they are
    //already following the target user
    fetch(`${apiURL}/user/`, options)
        .then(r => r.json())
        .then(r => {
            if (r.following.includes(user.id)) {    
                //if they are, unfollow the user
                options = {
                    method: "PUT",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        "Authorization" : "Token " + localStorage.getItem("Token")
                    }
                }
                fetch(`${apiURL}/user/unfollow?username=${user.username}`, options)
                //Update the follow button
                const followBtn = document.getElementById("followButton")
                followBtn.className="button button-secondary"
                followBtn.textContent="Follow" 

                //Update follow count
                const followers=document.getElementById("followerCount")
                followers.textContent=parseInt(followers.textContent)-1

                //Rebuild Feed
            } else {
                //otherwise follow the user
                options = {
                    method: "PUT",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        "Authorization" : "Token " + localStorage.getItem("Token")
                    }
                }
                fetch(`${apiURL}/user/follow?username=${user.username}`, options)

                //Update the follow button
                const followBtn = document.getElementById("followButton")
                followBtn.className="button button-primary"
                followBtn.textContent="Unfollow" 

                //Update follow count
                const followers=document.getElementById("followerCount")
                followers.textContent=parseInt(followers.textContent)+1

                //Rebuild feed
            }
        })
    

}

async function usrFeedBuild(items) {
    const feed = document.getElementById("usrFeed")
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
    
    //Set the upvote image based on whether the logged in user has upvoted it
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        const upvoteImage = document.createElement("input")
        upvoteImage.type="image"
        upvoteImage.setAttribute("src", "images/upvoteDefault.png")
    } else {
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
    }

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




function rebuildNavBar() {
    //Clears the navbar, then repopulates it based on the current paramaters
        //To be used when changing between logged in and logged out to ensure
        //Correct context menu
    const nav = document.getElementById("nav")

    //Loop through the nav bar's children and remove them until there are no children left
    const children = nav.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }
    buildNavBar()
}

function editUserProfile(user) {
    //Close the profile modal and open the edit modal
    closeBottomModal()
    clearModal()
    openModal()

    //Build all the elements of the field
    const modalHeader = document.getElementsByClassName("modal-header")

    const title=document.createElement("h2")
    title.textContent=user.username
    modalHeader[0].append(title)

    const fields = document.getElementsByClassName("right")

    const btn = document.createElement("button")
    btn.className="button button-secondary"
    btn.textContent="Submit Changes"
    btn.style.float="left"

    const br1 = document.createElement("br")

    const form = document.createElement("form")
    form.id="updateForm"
    fields[0].append(form)

    const error = document.createElement("div")
    error.id = "updateError"
    const errorText=document.createElement("p")
    errorText.className="errorText"
    errorText.textContent="Please fill at least one field"
    error.append(errorText)

    const nameLab = document.createElement("label")
    nameLab.textContent="Name:\t"
    const emailLab = document.createElement("label")
    emailLab.textContent="Email:\t"
    const passLab = document.createElement("label")
    passLab.textContent="Password:\t"

    //Set the current values to be the placeholders for the input fields
    const nameIn = document.createElement("input")
    nameIn.className="textInput profForm"
    nameIn.setAttribute("placeholder", user.name)
    nameIn.setAttribute("type", "textInput")
    const emailIn = document.createElement("input")
    emailIn.className="textInput profForm"
    emailIn.setAttribute("placeholder", user.email)
    emailIn.setAttribute("type", "textInput")
    const passIn = document.createElement("input")
    passIn.className="textInput profForm"
    passIn.setAttribute("placeholder", "Password")
    passIn.setAttribute("type", "password")

    form.append(error)
    form.append(nameLab)
    form.append(nameIn)
    form.append(emailLab)
    form.append(emailIn)
    form.append(passLab)
    form.append(passIn)
    form.append(br1)
    form.append(btn)

    //Create an event listener on the button to update the profile
    btn.addEventListener("click", function(e) {
        e.preventDefault()
        //If all the fields are empty, show the error
        if (nameIn.value==="" && emailIn.value==="" && passIn.value===""){
            error.style.display = "block"
            return
        }
        const apiURL = localStorage.getItem("apiURL")
        //Only store in the data object fields that have had data entered
        const data = {}
        if (nameIn.value!="") {data.name=nameIn.value}
        if (emailIn.value!="") {data.email=emailIn.value}
        if (passIn.value!="") {data.password=passIn.value}

        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            },
            body: JSON.stringify(data)
        }
        //Make the request
        fetch(`${apiURL}/user/`, options)
            .then(r=> {
                closeModal()

                options = {
                    method: "GET",
                    headers: {
                        'Content-Type' : 'application/JSON',
                        "Authorization" : "Token " + localStorage.getItem("Token")
                    }
                }
                fetch(`${apiURL}/user/`, options)
                    .then(r => r.json())
                    //Once the request has processed reopen the user profile with the 
                    //most up to date data
                    .then(r => {showUserProfile(r)})
            })
    })

}

export {buildNavBar, showUserProfile, rebuildNavBar}