function ShowLoginForm() {
    clearModal()
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
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault()
        tryLogin()
    })

    form.append(uname)
    form.append(pword)
    form.append(br)
    form.append(submitBtn)

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

    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")
    const modalFooter = document.getElementsByClassName("modal-footer")
    
    const left = document.getElementsByClassName("left")
    const sideImage = document.createElement("img")
    sideImage.setAttribute("src", "images/loginImage.png")
    sideImage.id="sideImage"
    left[0].append(sideImage)

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
    localStorage.removeItem("Token")
    localStorage.removeItem("userID")
    rebuildNavBar()
    rebuildFeed()
}

function tryLogin() {
    const data = {
        username : document.getElementById("uname").value,
        password : document.getElementById("pword").value
    }

    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        },
        body: JSON.stringify(data)

    }

    fetch(`${apiURL}/auth/login`, options)
        .then(r => r.json())
        .then(r => {
            localStorage.setItem("Token", r.token)
            if (localStorage.getItem("Token")==="undefined") {
                const error = document.getElementById("loginError")
                error.style.display = "block"
                document.getElementById("pword").value=""
            } else {
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

    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        },
        body: JSON.stringify(data)

    }

    fetch(`${apiURL}/auth/signup`, options)
        .then(r => {
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
            if (localStorage.getItem("Token")==="undefined") {
                const error = document.getElementById("loginError")
                error.style.display = "block"
            } else {
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
    let userID
    fetch(`${apiURL}/user/`, options)
        //.then(r => {console.log(r.status); return r})
        .then(r => r.json())
        .then(r => {
            localStorage.setItem("userID", r.id)
            return r.id
        })
    
    
}