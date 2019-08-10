// Build the modal
function showLoginModal() {

    const modal = document.createElement("div")
    modal.id = "myModal"
    modal.class= "modal"

    document.body.append(modal)

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
    const headerText = document.createElement("h2")
    headerText.textContent="Modal Header"
    modalHeader.append(span)
    modalHeader.append(headerText)
    
    const modalText1 = document.createElement("p")
    modalText1.textContent="Text in the modal";
    const modalText2 = document.createElement("p")
    modalText2.textContent="More text"
    modalBody.append(modalText1)
    modalBody.append(modalText2)
    
    const footerText = document.createElement("h3")
    footerText.textContent="Modal Footer"
    modalFooter.append(footerText)


    // Get the button that opens the modal
        //const btn = document.getElementById("login-button");
    
    // Get the <span> element that closes the modal
    
    // When the user clicks the button, open the modal 
    
}