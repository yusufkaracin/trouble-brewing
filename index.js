
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".form-input");
    const characterCards = document.querySelectorAll(".character-card");

    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();

        characterCards.forEach(card => {
            const charName = card.querySelector("h3").getAttribute("data-char").toLowerCase();
            if (charName.includes(searchValue)) {
                card.style.display = "flex"; // Show matching cards
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });
    });
});
