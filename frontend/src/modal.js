// Build the modal
function buildModal() {
    const modal = document.getElementById("myModal")

    const modalContent = document.createElement("div")
    modalContent.className="modal-content"
    const modalHeader = document.createElement("div")
    modalHeader.className="modal-header"
    const modalBody = document.createElement("div")
    modalBody.className="modal-body"
    const modalFooter = document.createElement("div")
    modalFooter.className="modal-footer"

    modal.append(modalContent)
    modalContent.append(modalHeader)
    modalContent.append(modalBody)
    modalContent.append(modalFooter)

    const span = document.createElement("span")
    span.textContent="×";
    span.className="close"
    modalHeader.append(span)

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function() {
        modal.style.display = "none";
    })

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", e => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    })

    //modal.style.display="none"
}

function clearModal() {
    const modal = document.getElementById("myModal")
    
    const children = modal.children
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }

    buildModal()
}