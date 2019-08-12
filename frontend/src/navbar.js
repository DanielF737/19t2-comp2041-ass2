export function buildNavBar () {
    const root = document.getElementById("root")
    const modal = document.getElementById("myModal")
    const nav = document.getElementById("nav")

    const logo = document.createElement("h1")
    logo.className="flex-center"
    logo.textContent="Seddit"
    logo.id="logo"
    nav.append(logo)

    const navList = document.createElement("ul")
    navList.className="nav"
    nav.append(navList)
    const li1 = document.createElement("li")
    li1.className="nav-item"

    const search = document.createElement("input")
    search.setAttribute("data-id-search", "")
    search.setAttribute("placeholder", "Search Seddit")
    search.setAttribute("type", "search")
    search.id="search"

    li1.append(search)
    navList.append(li1)
    
    if (localStorage.getItem("Token") === null || localStorage.getItem("Token")=="undefined") {
        const li2 = document.createElement("li")
        li2.className="nav-item"
        const login = document.createElement("button")
        login.textContent="Log In"
        login.className="button button-primary"
        //login.id="login-button"
        login.setAttribute("data-id-login", "")
        li2.append(login)
        navList.append(li2)
        login.addEventListener("click", function() {
            //Go to login form
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
        signup.addEventListener("click", function() {
            //Go to register form
            modal.style.display = "block"
            ShowRegisterForm()
        })
    } else {
        const li2 = document.createElement("li")
        li2.className="nav-item"
        const greeting = document.createElement("p")
        greeting.id="greeting"
        greeting.textContent="Welcome, "
        const profileLink = document.createElement("a")
        profileLink.className="upvoteCount"

        const apiURL = localStorage.getItem("apiURL")
        let options = {
            method: "GET",
            headers: {
                'Content-Type' : 'application/JSON',
                "Authorization" : "Token " + localStorage.getItem("Token")
            }
        }

        fetch(`${apiURL}/user/`, options)
            //.then(r => {console.log(r.status); return r})
            .then(r => r.json())
            .then(r => {
                profileLink.textContent=r.username
                profileLink.addEventListener("click", function() {
                    showUserProfile(r)
                })
            })

        
        greeting.append(profileLink)
        li2.append(greeting)
        navList.append(li2)

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

function rebuildNavBar() {
    const nav = document.getElementById("nav")

    const children = nav.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }
    buildNavBar()
}

function showUserProfile(user) {
    console.log(user)
    clearModal()
    openModal()
    
    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")
    const modalFooter = document.getElementsByClassName("modal-footer")
    
    const title=document.createElement("h2")
    title.textContent=user.username
    modalHeader[0].append(title)

    const name = document.createElement("p")
    name.textContent="Name: " + user.name
    const email = document.createElement("p")
    email.textContent = "Email: " + user.email
    const followers = document.createElement("p")
    followers.textContent = "Followers: " + user.followed_num
    const following = document.createElement("p")
    following.textContent = "Following: " + user.following.length
    const posts = document.createElement("p")
    posts.textContent = "Posts: " + user.posts.length
    const upvotes = document.createElement("p")
    
    if (user.posts.length > 0) {
        localStorage.setItem("Upvotes", 0)
        for (post of user.posts) {
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
                console.log(parseInt(localStorage.getItem("Upvotes")))
                upvotes.textContent="Upvotes: " + localStorage.getItem("Upvotes")
            })
        }
    } else {
        upvotes.textContent="Upvotes: 0"
    }

    modalBody[0].append(name)
    modalBody[0].append(email)
    modalBody[0].append(followers)
    modalBody[0].append(following)
    modalBody[0].append(posts)
    modalBody[0].append(upvotes)
}