function showPostForm() {
    clearBottomModal()
    buildPostModal()
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
    const postImage = document.createElement("input")
    postImage.setAttribute("type", "file")
    postImage.setAttribute("accept", ".png")
    postImage.className = "fileInput"
    postImage.id="postImage"
    const submitBtn = document.createElement("button")
    submitBtn.textContent="Create Post"
    submitBtn.className="button button-secondary"
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault()
        tryPost()
    })

    postForm.append(postSub)
    postForm.append(postTitle)
    postForm.append(postText)
    postForm.append(postImage)
    postForm.append(submitBtn)
}

async function tryPost() {
    //console.log("yeet")
    let base64
    if (document.getElementById("postImage").value!="") {
        base64=await toDataURL(document.getElementById("postImage").files[0])
    }

    const data = {
        title : document.getElementById("postTitle").value,
        text : document.getElementById("postText").value,
        subseddit : document.getElementById("postSub").value,
        image : base64
    }    
    //console.log(data)

    if (data.title===""||data.text===""||data.subseddit==="") {
        const errorTest = document.getElementById("postError")
        errorTest.style.display="block";
        //console.log("empty post fields error")
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

    fetch(`${apiURL}/post`, options)
        //.then(r => {console.log(r.status); return r})
        .then(r => r.json())
        .then(r => {
            //do stuff
        })


    closeBottomModal()
}

function toDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener("load", () => resolve(reader.result.split(',')[1]))
        reader.addEventListener("error", (error) => reject(error))
    })
}
