function  buildFooter() {
    const root = document.getElementById("root")
    const footer = document.createElement("footer")
    root.append(footer)
    const p = document.createElement("p")
    p.textContent="Frontend by Ferraro Softworks"
    footer.append(p)
}