document.addEventListener("DOMContentLoaded", () => {
    loadHouseDetails();
});

// LOAD SELECTED HOUSE
function loadHouseDetails() {
    const index = localStorage.getItem("selectedHouse");
    const houses = JSON.parse(localStorage.getItem("ownerHouses")) || [];

    if (!houses[index]) return;

    const house = houses[index];

    document.getElementById("houseHeader").innerHTML = `
        <h1>${house.name}</h1>
        <p>${house.location}</p>
    `;

    document.getElementById("houseImage").src = house.image || "https://placehold.co/600x400";
    document.getElementById("houseDesc").textContent = house.description || "No description provided.";

    // Rooms
    const roomsList = document.getElementById("roomsList");
    roomsList.innerHTML = "";

    (house.rooms || []).forEach(room => {
        const div = document.createElement("div");
        div.classList.add("room-card");

        div.innerHTML = `
            <p><b>Room Name:</b> ${room.name}</p>
            <p><b>Capacity:</b> ${room.capacity}</p>
            <p><b>Price:</b> ₱${room.price} / month</p>
        `;
        roomsList.appendChild(div);
    });

    // Load rating
    const rating = house.rating || 0;
    highlightStars(rating);
}

// STAR RATING
function rateHouse(stars) {
    const index = localStorage.getItem("selectedHouse");
    let houses = JSON.parse(localStorage.getItem("ownerHouses")) || [];

    houses[index].rating = stars;
    localStorage.setItem("ownerHouses", JSON.stringify(houses));

    highlightStars(stars);
    document.getElementById("ratingText").textContent = `You rated this ${stars} star(s).`;
}

function highlightStars(num) {
    const allStars = document.querySelectorAll(".stars span");
    allStars.forEach((star, index) => {
        star.classList.toggle("selected", index < num);
    });
}

// NAVIGATION
function goReserve() {
    window.location.href = "customerReserve.html";
}

function goDashboard() {
    window.location.href = "customerDashboard.html";
}

function goReservations() {
    window.location.href = "customerReservations.html";
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "landingpage.html";
}
