var body = document.querySelector("body");
// set the mode according to the system preference
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    //dark mode
    console.info("DARK MODE ACTIVATED");
    body.classList.add("dark");
}
// listen for the mode change
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (e.matches) {
        console.info("ACTIVATED DARK MODE");
        return body.classList.add("dark");
    }
    console.info("ACTIVATED LIGHT MODE");
    return body.classList.remove("dark");
});
