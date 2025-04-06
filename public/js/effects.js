
const EFFECT_ENABLERS = [
    enableBoids,
    enableText,
];


async function startGlitch(element, duration) {
    return new Promise((resolve) => {
        const originalText = element.textContent;
        const length = originalText.length;
        const glitchChars = ['@', '#', '$', '%', '&', '*', '+', '!', '?', '~'];
        
        element.classList.add('glitching');
        
        let currentLength = 0;
        const interval = setInterval(() => {
            const revealed = originalText.slice(0, currentLength);
            const remaining = length - currentLength;
            const glitchy = Array.from({ length: remaining }, () => {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }).join('');
            
            element.textContent = revealed + glitchy;
            
            currentLength++;
            if (currentLength > length) {
                clearInterval(interval);
                element.textContent = originalText;
                element.style.color = '';
                element.classList.remove('glitching');
                resolve();
            }
        }, duration / length);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // Get random effect enabler
    const randomEffectEnabler = EFFECT_ENABLERS[Math.floor(Math.random() * EFFECT_ENABLERS.length)];
    randomEffectEnabler();

    document.querySelectorAll('.glitch').forEach((element) => {
        element.addEventListener('mouseenter', async () => {
            if (element.classList.contains('glitching')) return;
            await startGlitch(element, 600);
        });
    });
});
