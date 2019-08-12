import {clearModal, openModal} from "./modal.js"
import {ShowLoginForm, ShowRegisterForm, signOut} from './loginForm.js'

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
            .then(r => {
                profileLink.textContent=r.username
                profileLink.addEventListener("click", function() {
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

function showUserProfile(user) {
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

export {buildNavBar, showUserProfile, rebuildNavBar}