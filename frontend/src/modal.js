function buildModal() {
    //Create all the base elements of the modal
    const modal = document.getElementById("myModal")

    const modalContent = document.createElement("div")
    modalContent.className="modal-content"
    const modalHeader = document.createElement("div")
    modalHeader.className="modal-header"
    const modalBody = document.createElement("div")
    modalBody.className="modal-body"
    const modalFooter = document.createElement("div")
    modalFooter.className="modal-footer"

    const leftColumn = document.createElement("div")
    const sideImage = document.createElement("img")
    sideImage.setAttribute("src", "images/loginImage.png")
    sideImage.id="sideImage"
    leftColumn.append(sideImage)

    const rightColumn = document.createElement("div")
    leftColumn.className=("column left")
    rightColumn.className=("column right")

    modal.append(modalContent)
    modalContent.append(leftColumn)
    modalContent.append(rightColumn)

    rightColumn.append(modalHeader)
    rightColumn.append(modalBody)
    rightColumn.append(modalFooter)

    const span = document.createElement("span")
    span.textContent="×";
    span.className="close"
    modalHeader.append(span)

    // When the user clicks on x, close the modal
    span.addEventListener("click", function() {
        closeModal()
    })

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", e => {
        if (e.target == modal) {
            closeModal()
        }
    })
}

function clearModal() {
    const modal = document.getElementById("myModal")
    //Loop through all the modals children and delete them
    const children = modal.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }

    buildModal()
}

function openModal() {
    //Show the modal
    const modal = document.getElementById("myModal")
    modal.style.display = "block"
}

function closeModal() {
    //Hide the modal
    const modal = document.getElementById("myModal")
    modal.style.display = "none"
}

function buildPostModal() {
    //Create all the base elements of the modal
    const modal = document.getElementById("myBottomModal")

    const modalContent = document.createElement("div")
    modalContent.className="bottom-modal-content"
    const modalHeader = document.createElement("div")
    modalHeader.className="bottom-modal-header"
    const modalBody = document.createElement("div")
    modalBody.className="bottom-modal-body"
    const modalFooter = document.createElement("div")
    modalFooter.className="bottom-modal-footer"

    modal.append(modalContent)
    modalContent.append(modalHeader)
    modalContent.append(modalBody)
    modalContent.append(modalFooter)

    const span = document.createElement("span")
    span.textContent="×";
    span.className="bottom-close"
    modalHeader.append(span)

    // When the user clicks on x, close the modal
    span.addEventListener("click", function() {
        closeBottomModal()
    })

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", e => {
        if (e.target == modal) {
            closeBottomModal()
        }
    })
    
}

function clearBottomModal() {
    const modal = document.getElementById("myBottomModal")
    //Clear all the children of the modal then rebuild it
    const children = modal.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }

    buildModal()
}

function openBottomModal() {
    //Show the bottom modal
    buildPostModal()
    const modal = document.getElementById("myBottomModal")
    modal.style.display="block";
}

function closeBottomModal() {
    //Hide the bottom modal
    const modal = document.getElementById("myBottomModal")
    modal.style.display="none";
}

export {buildModal, clearModal, openModal, closeModal, buildPostModal, clearBottomModal, openBottomModal, closeBottomModal}