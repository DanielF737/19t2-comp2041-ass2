/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import {buildFeed} from './feed.js'
import {buildNavBar} from './navbar.js'

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
  if (localStorage.getItem("Token")==="undefined") {
    localStorage.removeItem("Token")
  }

  localStorage.setItem("apiURL", apiUrl)

  const root = document.createElement("div")
  root.id="root"
  document.body.appendChild(root)

  const nav = document.createElement("header")
  nav.className="banner"
  nav.id="nav"
  root.append(nav)

  const modal = document.createElement("div")
  modal.id = "myModal"
  modal.className= "modal"
  root.append(modal)
  
  const bottomModal = document.createElement("div")
  bottomModal.id = "myBottomModal"
  bottomModal.className= "bottom-modal"
  root.append(bottomModal)

  buildNavBar() 
  
  const main = document.createElement("main")
  main.setAttribute("role", "main")
  main.id="main"
  root.append(main)

  buildFeed()

}

export default initApp;
