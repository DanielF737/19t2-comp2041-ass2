import {buildPostModal, clearBottomModal, closeBottomModal} from "./modal.js"

function showPostForm() {
    clearBottomModal()
    buildPostModal()
    //Build the new post form
    const modalHeader = document.getElementsByClassName("bottom-modal-header")
    const modalBody = document.getElementsByClassName("bottom-modal-body")
    const modalFooter = document.getElementsByClassName("bottom-modal-footer")

    const title = document.createElement("h1")
    title.textContent="New Post"
    modalHeader[0].append(title)

    const postForm = document.createElement("form")
    postForm.id="newPost"
    modalBody[0].append(postForm)
    modalBody[0].style.textAlign = "center"

    const errorText=document.createElement("p")
    errorText.className="errorText"
    errorText.id="postError"
    errorText.textContent="Please ensure all required fields are filled"
    errorText.style.display="none";
    postForm.append(errorText)

    const postTitle = document.createElement("input")
    postTitle.className="textInputThin"
    postTitle.id="postTitle"
    postTitle.setAttribute("placeholder", "Post Title")
    postTitle.setAttribute("type", "text")
    const postSub = document.createElement("input")
    postSub.className="textInputThin"
    postSub.id="postSub"
    postSub.setAttribute("placeholder", "Subseddit")
    postSub.setAttribute("type", "text")
    const postText = document.createElement("textarea")
    postText.className="textArea"
    postText.id="postText"
    postText.setAttribute("placeholder", "Post Text")
    postText.setAttribute("type", "text")

    const br = document.createElement("br")

    const imgDiv = document.createElement("div")
    imgDiv.className="box"
    const label = document.createElement("label")
    label.className="button button-primary padd"
    const labText = document.createTextNode("Find image")
    label.setAttribute("for", "postImage")
    label.append(labText)

    const postImage = document.createElement("input")
    postImage.setAttribute("type", "file")
    postImage.setAttribute("accept", ".png")
    postImage.className = "fileInput"
    postImage.id="postImage"
    
    imgDiv.append(postImage)
    imgDiv.append(label)
    
    const submitBtn = document.createElement("button")
    submitBtn.textContent="Create Post"
    submitBtn.className="button button-secondary"
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault()
        //When the form is submitted try make the post
        tryPost()
    })

    postForm.append(postSub)
    postForm.append(postTitle)
    postForm.append(postText)
    postForm.append(br)
    postForm.append(imgDiv)
    postForm.append(submitBtn)
}

async function tryPost() {
    //Convert the image to a base64 string
    let base64
    if (document.getElementById("postImage").value!="") {
        base64=await toDataURL(document.getElementById("postImage").files[0])
    }

    //Build the request payload
    const data = {
        title : document.getElementById("postTitle").value,
        text : document.getElementById("postText").value,
        subseddit : document.getElementById("postSub").value,
        image : base64
    } 

    //If any of the required fields are left blank, exit the funciton and
    //show the error
    if (data.title===""||data.text===""||data.subseddit==="") {
        const errorTest = document.getElementById("postError")
        errorTest.style.display="block";
        return;
    } 


    const apiURL = localStorage.getItem("apiURL")
    let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON',
            "Authorization" : "Token " + localStorage.getItem("Token")
        },
        body: JSON.stringify(data)

    }
    //Make the post request
    fetch(`${apiURL}/post`, options)

    //Close the modal
    closeBottomModal()
}

function toDataURL(file) {
    //Make a promise to return the base64 string, read the file then return
    //the string
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener("load", () => resolve(reader.result.split(',')[1]))
        reader.addEventListener("error", (error) => reject(error))
    })
}

export {showPostForm, tryPost, toDataURL}