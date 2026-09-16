const toggleWrapper = document.querySelector('.language-slider-wrapper');

export function handleLanguageToggle() {
    if (!toggleWrapper) {
        console.error('Language toggle initialization failed: Element not found.'); 
        return () => {}; // Return a no-op cleanup function
    }

    buildLanguageToggle();
}

function buildLanguageToggle() {
    if(toggleWrapper) {
        // Create the slider track
        const switchDiv = document.createElement('label');
        switchDiv.classList.add('switch');
        toggleWrapper.appendChild(switchDiv);

        // Create the hidden checkbox input for the toggle
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.id = 'toggleSwitch';
        switchInput.style.display = 'none';
        switchDiv.appendChild(switchInput);

        // Slider Thumb
        const slider = document.createElement('span');
        slider.classList.add('slider');
        switchDiv.appendChild(slider);

        // Language Label
        const currentLanguage = sessionStorage.getItem('language') || 'en';
        const englishLabel = document.createElement('span');
        englishLabel.classList.add('slider-label-english');
        englishLabel.textContent = 'English';
        slider.appendChild(englishLabel);

        const spanishLabel = document.createElement('span');
        spanishLabel.classList.add('slider-label-spanish');
        spanishLabel.textContent = 'Español';
        slider.appendChild(spanishLabel);

        // Set the initial state of the toggle based on the current language
        if (currentLanguage === 'en') {
            switchInput.checked = false;
            switchDiv.setAttribute('aria-checked', 'false');
            spanishLabel.classList.remove('hidden');
            englishLabel.classList.add('hidden');
        } else {
            switchInput.checked = true;
            switchDiv.setAttribute('aria-checked', 'true');
            spanishLabel.classList.add('hidden');
            englishLabel.classList.remove('hidden');
        }

        // Add click event listener to the language toggle button
        switchInput.addEventListener('change', onToggle);
    }
}

/* Handler for when the lanaguage toggle is clicked */
function onToggle(event) {
    const isSpanish = event.target.checked;
    const spanishLabel = document.querySelector('.slider-label-spanish');
    const englishLabel = document.querySelector('.slider-label-english');

    // Toggle the visibility of the language labels
    spanishLabel.classList.toggle('hidden', isSpanish);
    englishLabel.classList.toggle('hidden', !isSpanish);

    // Get the new language based on the current state of the toggle
    const newLanguage = isSpanish ? 'es' : 'en';
    sessionStorage.setItem('language', newLanguage);

    // Update the displayed content and session storage based on the new language
    updateLanguage(newLanguage);
}

/* Based on language toggle state, display the appropriate language content and update session storage */
function updateLanguage(newLanguage) {
    if (newLanguage === 'en') {
        // Show English content and hide Spanish content
        console.log("Language set to English");
    } else {
        // Show Spanish content and hide English content
        console.log("Language set to Spanish");
    }
}