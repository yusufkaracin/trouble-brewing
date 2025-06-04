document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".form-input");
    const characterCards = document.querySelectorAll(".character-card");
    const modal = document.getElementById("character-modal");
    const modalDescription = document.getElementById("modal-description");

    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();

        characterCards.forEach(card => {
            const charName = card.getAttribute("data-char").toLowerCase();
            if (charName.includes(searchValue)) {
                card.style.display = "flex"; // Show matching cards
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });
    });

    let touchTimeout;
    let isTouching = false;

    const resetTouchTimeout = () => {
        clearTimeout(touchTimeout);
        if (!isTouching) {
            touchTimeout = setTimeout(() => {
                modal.classList.add("hidden");
            }, 1000);
        }
    };

    characterCards.forEach(card => {
        let longTouchTimeout;

        card.addEventListener("touchstart", () => {
            longTouchTimeout = setTimeout(async () => {
                const charName = card.getAttribute("data-char");
                const charId = card.getAttribute("data-char-id"); // Assuming `data-char-id` exists

                try {
                    const response = await fetch(`./chars/${charId}.json`);
                    if (response.ok) {
                        const data = await response.json();

                        // Fetch template HTML
                        const templateResponse = await fetch('./chars/template.html');
                        const templateHTML = await templateResponse.text();

                        // Populate modal content dynamically
                        const parser = new DOMParser();
                        const templateDoc = parser.parseFromString(templateHTML, 'text/html');

                        const pContent = templateDoc.querySelector('#p-content');
                        const ulContent = templateDoc.querySelector('#ul-content');
                        const examplesContent = templateDoc.querySelector('#examples-content');

                        // Populate paragraphs
                        pContent.innerHTML = data.p.map(
                            text => `<p class="text-[#141414] text-base font-normal leading-normal pb-3 pt-1 px-4">${text}</p>`
                        ).join('');

                        // Populate list items
                        ulContent.innerHTML = data.li.map(
                            text => `<li>${text}</li>`
                        ).join('');

                        // Populate examples with newline handling
                        examplesContent.innerHTML = data.examples.map(
                            example => `
                                <div class="p-4">
                                    <div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
                                        ${example.split('\n').map(
                                            line => `<p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">${line}</p>`
                                        ).join('')}
                                    </div>
                                </div>
                            `
                        ).join('');

                        modalDescription.innerHTML = templateDoc.body.innerHTML; // Render the updated template
                    } else {
                        modalDescription.textContent = `Details about ${charName} not found.`;
                    }
                } catch (error) {
                    modalDescription.textContent = `Error fetching details for ${charName}.`;
                }

                modal.classList.remove("hidden");

                isTouching = true;
                resetTouchTimeout();
            }, 500);
        });

        card.addEventListener("touchend", () => {
            clearTimeout(longTouchTimeout); // Cancel showing modal if touch ends quickly
            isTouching = false;
            resetTouchTimeout();
        });
    });

    document.addEventListener("touchstart", () => {
        isTouching = true;
        resetTouchTimeout();
    });

    document.addEventListener("touchend", () => {
        isTouching = false;
        resetTouchTimeout();
    });
});