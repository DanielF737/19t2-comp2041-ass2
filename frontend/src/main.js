/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import {buildFeed, infiniteScroll} from './feed.js'
import {buildNavBar} from './navbar.js'
import {buildModal, buildPostModal} from './modal.js'
// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
  //If a bad token is left over delete it
  if (localStorage.getItem("Token")==="undefined") {
    localStorage.removeItem("Token")
  }

  //Save the api URL to the local storage
  localStorage.setItem("apiURL", apiUrl)

  //Build some of the documents base html elements
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

  //Build the nav bar
  buildNavBar() 
  
  const main = document.createElement("main")
  main.setAttribute("role", "main")
  main.id="main"
  root.append(main)

  //Build the feed
  buildFeed()
  buildPostModal()
  buildModal()

  //Start the infinite scroll functions
  infiniteScroll()
}

export default initApp;
