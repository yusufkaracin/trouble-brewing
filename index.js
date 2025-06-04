document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".form-input");
    const characterCards = document.querySelectorAll(".character-card");
    const modal = document.getElementById("character-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-image");
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
                const charImageSrc = card.querySelector("img").src;
                const charId = card.getAttribute("data-char-id"); // Assuming `data-char-id` exists

                modalTitle.textContent = charName;
                modalImage.src = charImageSrc;

                try {
                    const response = await fetch(`./chars/${charId}.html`);
                    if (response.ok) {
                        const description = await response.text();
                        modalDescription.innerHTML = description; // Render HTML content
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