import {rebuildFeed} from './feed.js'
import {rebuildNavBar} from './navbar.js'
import {clearModal, closeModal} from "./modal.js"

function ShowLoginForm() {
    clearModal()
    //Build the login form elements
    const modal = document.getElementById("myModal");

    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")
    const modalFooter = document.getElementsByClassName("modal-footer")
    
    const title=document.createElement("h2")
    title.textContent="Log In"
    modalHeader[0].append(title)
        
    const error = document.createElement("div")
    error.id = "loginError"
    const errorText=document.createElement("p")
    errorText.className="errorText"
    errorText.textContent="Invalid username/password"
    modalBody[0].append(error)
    error.append(errorText)

    const form=document.createElement("form")
    form.id="login"
    modalBody[0].append(form)
    
    const br = document.createElement("br")

    const uname = document.createElement("input")
    uname.setAttribute("placeholder", "Username")
    uname.setAttribute("type", "textInput")
    uname.required=true;
    uname.className="textInput"
    uname.id="uname"

    const pword = document.createElement("input")
    pword.setAttribute("placeholder", "Password")
    pword.setAttribute("type", "password")
    pword.required=true;
    pword.className="textInput"
    pword.id="pword"

    const submitBtn = document.createElement("button")
    submitBtn.textContent="Log In"
    submitBtn.className="button button-secondary"
    //Create an event listener on the submit button to try the login
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault()
        tryLogin()
    })

    form.append(uname)
    form.append(pword)
    form.append(br)
    form.append(submitBtn)

    //Create the element to open the register form if the user opened
    //the wrong one
    const newTo = document.createElement("p")
    const text = document.createTextNode("New to Seddit? ")
    const link = document.createElement("a")
    link.textContent="Sign Up"
    newTo.appendChild(text)
    newTo.appendChild(link)
    link.id="signUp"
    modalBody[0].append(newTo)

    link.addEventListener("click", function() {
        ShowRegisterForm()
    })
}

function ShowRegisterForm() {
    clearModal()
    const modal = document.getElementById("myModal");
    //Build the register form
    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")
    const modalFooter = document.getElementsByClassName("modal-footer")

    const error = document.createElement("div")
    error.id = "loginError"
    const errorText=document.createElement("p")
    errorText.className="errorText"
    errorText.textContent="Username taken"
    modalBody[0].append(error)
    error.append(errorText)

    const title=document.createElement("h2")
    title.textContent="Sign Up"
    modalHeader[0].append(title)
    
    const form=document.createElement("form")
    form.id="signup"
    modalBody[0].append(form)
    
    const br = document.createElement("br")

    const uname = document.createElement("input")
    uname.setAttribute("placeholder", "Username")
    uname.setAttribute("type", "textInput")
    uname.className="textInput"
    uname.id="uname"

    const pword = document.createElement("input")
    pword.setAttribute("placeholder", "Password")
    pword.setAttribute("type", "password")
    pword.className="textInput"
    pword.id="pword"

    const email = document.createElement("input")
    email.setAttribute("placeholder", "Email")
    email.setAttribute("type", "textInput")
    email.className="textInput"
    email.id="email"

    const name = document.createElement("input")
    name.setAttribute("placeholder", "Name")
    name.setAttribute("type", "textInput")
    name.className="textInput"
    name.id="nameUser"
    
    //Create the event listener to try to submit the register req
    const submitBtn = document.createElement("button")
    submitBtn.textContent="Sign Up"
    submitBtn.className="button button-secondary"
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault()
        tryRegister(   

        )
    })

    form.append(uname)
    form.append(pword)
    form.append(email)
    form.append(name)
    form.append(br)
    form.append(submitBtn)

    const newTo = document.createElement("p")
    const text = document.createTextNode("Already have an account? ")
    const link = document.createElement("a")
    link.textContent="Log In"
    newTo.appendChild(text)
    newTo.appendChild(link)
    link.id="signUp"
    modalBody[0].append(newTo)

    link.addEventListener("click", function() {
        ShowLoginForm()
    })
}

function signOut() {
    //Delete the auth token and the user ID from local storage
    //then rebuild the page
    localStorage.removeItem("Token")
    localStorage.removeItem("userID")
    rebuildNavBar()
    rebuildFeed()
    const title=document.getElementsByClassName("feed-title")
    title[0].selectedIndex=0 
}

function tryLogin() {
    const data = {
        username : document.getElementById("uname").value,
        password : document.getElementById("pword").value
    }
    //Grab the data from the login form
    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        },
        body: JSON.stringify(data)

    }
    //Make the login request
    fetch(`${apiURL}/auth/login`, options)
        .then(r => r.json())
        .then(r => {
            localStorage.setItem("Token", r.token)
            if (localStorage.getItem("Token")==="undefined") {
                //If the login fails, show the warning and clear the password field
                const error = document.getElementById("loginError")
                error.style.display = "block"
                document.getElementById("pword").value=""
                localStorage.removeItem("Token")
            } else {
                //If the login suceeds, save the auth token and rebuild the page
                saveUserID()
                closeModal()
                rebuildNavBar()
                rebuildFeed()
            }
        })
}

function tryRegister() {
    const data = {
        username : document.getElementById("uname").value,
        password : document.getElementById("pword").value,
        email : document.getElementById("email").value,
        name : document.getElementById("nameUser").value
    }
    //Read the data from the form
    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        },
        body: JSON.stringify(data)

    }
    //Make the post request
    fetch(`${apiURL}/auth/signup`, options)
        .then(r => {
            //If the request fails, show the relevant error message
            if (r.status === 409) {
                const error = document.getElementById("loginError")
                error.childNodes[0].textContent="Username taken"
            } else {
                const error = document.getElementById("loginError")
                error.childNodes[0].textContent="Malformed Request"
            }
            return r
        })
        .then(r => r.json())
        .then(r => {
            localStorage.setItem("Token", r.token)
            // additional error check
            if (localStorage.getItem("Token")==="undefined") {
                const error = document.getElementById("loginError")
                error.style.display = "block"
                localStorage.removeItem("Token")
            } else {
                //If the login suceeds, save the auth token and rebuild the page
                saveUserID()
                closeModal()
                rebuildNavBar()
                rebuildFeed()
            }
        })
}

function saveUserID() {
    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            "Authorization" : "Token " + localStorage.getItem("Token")
        }
    }
    //Fetch the current user, save the user ID to local storage
    fetch(`${apiURL}/user/`, options)
        .then(r => r.json())
        .then(r => {
            localStorage.setItem("userID", r.id)
            return r.id
        })
    
    
}

export {ShowLoginForm, ShowRegisterForm, signOut, tryLogin, tryRegister, saveUserID}