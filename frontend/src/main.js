/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
  const root = document.createElement("div")
  root.id="root"
  document.body.appendChild(root)

  const modal = document.createElement("div")
  modal.id = "myModal"
  modal.className= "modal"
  root.append(modal)
  
  buildNavBar() //Need to make this context sensitive
  
  const main = document.createElement("main")
  main.setAttribute("role", "main")
  main.id="main"
  root.append(main)

  buildFeed()

  buildFooter()
}

export default initApp;
