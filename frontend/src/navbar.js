function buildNavBar () {
    const root = document.getElementById("root")
    const modal = document.getElementById("myModal");

    const nav = document.createElement("header")
    nav.className="banner"
    nav.id="nav"
    const logo = document.createElement("h1")
    logo.className="flex-center"
    logo.textContent="Seddit"
    logo.id="logo"
    nav.append(logo)
    root.append(nav)

    const navList = document.createElement("ul")
    navList.className="nav"
    const li1 = document.createElement("li")
    li1.className="nav-item"

    const search = document.createElement("input")
    search.setAttribute("data-id-search", "")
    search.setAttribute("placeholder", "Search Seddit")
    search.setAttribute("type", "search")
    search.id="search"

    li1.append(search)
    navList.append(li1)
    
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
        console.log("we loggin in boys")
    })

    const li3 = document.createElement("li")
    li3.className="nav-item"
    const signup = document.createElement("button")
    signup.className="button button-secondary"
    signup.setAttribute("data-id-signup", "")
    signup.textContent="Sign Up"
    li3.append(signup)
    navList.append(li3)
    nav.append(navList)
    signup.addEventListener("click", function() {
        //Go to register form
        modal.style.display = "block"
        ShowRegisterForm()
        console.log("we signing up boys")
    })
}