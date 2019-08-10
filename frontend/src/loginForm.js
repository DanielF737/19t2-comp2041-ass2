function ShowLoginForm() {
    clearModal()
    const modal = document.getElementById("myModal");

    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")
    const modalFooter = document.getElementsByClassName("modal-footer")
    
    const title=document.createElement("h2")
    title.textContent="Login"
    modalHeader[0].append(title)
    
    const form=document.createElement("form")
    form.id="login"
    modalBody[0].append(form)
    
    const br = document.createElement("br")

    const uname = document.createElement("input")
    uname.setAttribute("placeholder", "Username")
    uname.setAttribute("type", "search")

    const pword = document.createElement("input")
    pword.setAttribute("placeholder", "Password")
    pword.setAttribute("type", "search")
    
    const submit = document.createElement("button")
    submit.textContent="Log In"
    submit.className="button button-secondary"

    form.append(uname)
    form.append(pword)
    form.append(br)
    form.append(submit)

}

function ShowRegisterForm() {
    clearModal()
    const modal = document.getElementById("myModal");

    const modalHeader = document.getElementsByClassName("modal-header")
    const modalBody = document.getElementsByClassName("modal-body")
    const modalFooter = document.getElementsByClassName("modal-footer")
    
    const title=document.createElement("h2")
    title.textContent="Login"
    modalHeader[0].append(title)
    
    const form=document.createElement("form")
    form.id="login"
    modalBody[0].append(form)
    
    const br = document.createElement("br")

    const uname = document.createElement("input")
    uname.setAttribute("placeholder", "Username")
    uname.setAttribute("type", "search")

    const pword = document.createElement("input")
    pword.setAttribute("placeholder", "Password")
    pword.setAttribute("type", "search")
    
    const submit = document.createElement("button")
    submit.textContent="Log In"
    submit.className="button button-secondary"

    form.append(uname)
    form.append(pword)
    form.append(br)
    form.append(submit)

}