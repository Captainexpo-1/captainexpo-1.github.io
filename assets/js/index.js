let isdark = false;


/* links
https://cloud-85xrjqmvv-hack-club-bot.vercel.app/0moon.svg
https://cloud-85xrjqmvv-hack-club-bot.vercel.app/1sun.svg
*/


function toggleDarkMode(button) {
    

    var element = document.body;
    element.classList.toggle("dark-mode");
    isdark = !isdark;
    if (isdark) {
        document.cookie = "darkmode=true;path=/";
    }
    else {
        document.cookie = "darkmode=false;path=/";
    }
    //set inner image of button to moon.svg or sun.svg
    if(button){
        if (isdark) {
            button.innerHTML = '<img src="https://cloud-85xrjqmvv-hack-club-bot.vercel.app/1sun.svg" alt="sun" width="30px" height="30px">';
            //set color to white
            button.querySelector("img").style.filter = "invert(1)";
        }
        else {
            button.innerHTML = '<img src="https://cloud-85xrjqmvv-hack-club-bot.vercel.app/0moon.svg" alt="moon" width="30px" height="30px">';
            //set color to black
            button.querySelector("img").style.color = "black";
        }
    }
    
}
function checkDark() {
    let cookie = document.cookie;
    if (cookie.includes("darkmode=true")) {
        toggleDarkMode();
        document.querySelector("#mode-button").innerHTML = '<img src="https://cloud-85xrjqmvv-hack-club-bot.vercel.app/1sun.svg" alt="moon" width="30px" height="30px" style="filter: invert(1)">';
    }else{
        document.querySelector("#mode-button").innerHTML = '<img src="https://cloud-85xrjqmvv-hack-club-bot.vercel.app/0moon.svg" alt="moon" width="30px" height="30px">';
    }
}