export function initLivePage() {
    // Check if a valid zoom link has been provided
    verifyValidLink();


    return function cleanupLivePage() {
        // Cleanup code for the live page can be added here if needed
    };
}

function verifyValidLink() {
    const joinButton = document.getElementById('join-button');
    const noLinkText = document.querySelector(".join-note");
    if(joinButton && noLinkText){
        if(joinButton.href){
            noLinkText.classList.add("hidden");
            joinButton.classList.remove('button-disabled');
        } else {
            noLinkText.classList.remove('hidden');
            joinButton.classList.add('button-disabled');
        }
    } else {
        console.error(`Cound not find required element: ${joinButton === undefined ? "Join Button" : "join-note span"}`);
    }
}