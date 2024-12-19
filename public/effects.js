
async function startGlitch(element, length){
    return new Promise((resolve, reject) => {
        const ogText = element.innerHTML;
        element.classList.add('glitching');
        const len = ogText.length;
        let curLen = 0;
        let curText = "";
        const interval = setInterval(() => {
            curText += ogText[curLen];
            element.innerHTML = curText + "&nbsp;".repeat(len - curLen - 1);
            if (curLen++ >= len-1){
                clearInterval(interval);
                element.innerHTML = ogText;
                element.classList.remove('glitching');
                resolve();
            }
        }, length/len);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.glitch').forEach((element) => {
        element.onmouseenter = async () => {
            if (element.classList.contains('glitching')) return;
            const og = element.innerHTML;
            console.log(og);
            await startGlitch(element, 300);
        };
    });
});