// -----------------------------
// ROLE SELECTION
// -----------------------------
function setRole(role) {
  localStorage.setItem("selectedRole", role); // "owner" or "customer"
}

// -----------------------------
// REGISTRATION FUNCTION
// -----------------------------
function signUp() {
  const role = localStorage.getItem("selectedRole"); // owner or customer

  if (!role) {
    alert("Please select a role first!");
    return;
  }

  const userData = {
    // ⭐ UNIQUE USER ID (IMPORTANT FOR MULTIPLE OWNERS)
    id: Date.now().toString(),

    firstName: document.getElementById("first-name").value,
    middleName: document.getElementById("middle-name")?.value || "",
    lastName: document.getElementById("last-name").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
    role: role // "owner" or "customer"
  };

  // Basic validation
  if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
    alert("Please fill out all required fields.");
    return;
  }

  // Load all users
  let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  // Optional: check duplicate email
  const existing = allUsers.find(u => u.email === userData.email);
  if (existing) {
    alert("This email is already registered. Please log in instead.");
    return;
  }

  // Save user
  allUsers.push(userData);
  localStorage.setItem("allUsers", JSON.stringify(allUsers));

  alert("Registration successful!");

  // Redirect to proper login page based on role
  if (role === "owner") {
    window.location.href = "loginOWNER.html";
  } else {
    window.location.href = "LoginCUSTOMER.html";
  }
}

// -----------------------------
// LOGIN FUNCTION
// -----------------------------
function loginUser() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  const foundUser = allUsers.find(u => u.email === email && u.password === pass);

  if (!foundUser) {
    alert("Incorrect email or password.");
    return;
  }

  // Save logged user
  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

  // Redirect dynamically based on role
  if (foundUser.role === "owner") {
    // Match your actual filename
    window.location.href = "OWnerPRofile.html";
  } else {
    // Match your actual filename
    window.location.href = "Customerprofile.html";
  }
}

// -----------------------------
// GENERIC PROFILE LOADER (if used)
// -----------------------------
function loadProfile() {
  const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!savedUser) return;

  const nameElem = document.querySelector(".name");
  const roleElem = document.querySelector(".role");
  const aboutElem = document.querySelector(".about-info");
  const welcomeElem = document.querySelector(".welcome");

  if (nameElem) {
    nameElem.textContent = `${savedUser.firstName} ${savedUser.lastName}`;
  }

  if (roleElem) {
    roleElem.textContent = savedUser.role === "owner" ? "Owner" : "Customer";
  }

  if (aboutElem) {
    aboutElem.innerHTML = `
      Username: ${savedUser.firstName.toLowerCase()}${savedUser.lastName.toLowerCase()}<br><br>
      Address: ${savedUser.address}<br><br>
      Email: ${savedUser.email}<br><br>
      Phone no.: ${savedUser.phone}<br><br>
      Role: ${savedUser.role}
    `;
  }

  if (welcomeElem) {
    welcomeElem.textContent = `Welcome, ${savedUser.firstName}!`;
  }
}

// -----------------------------
// LOGOUT FUNCTION
// -----------------------------
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "landingpage.html";
}

// -----------------------------
// DELETE ACCOUNT FUNCTION
// -----------------------------
function deleteAccount() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("No user is currently logged in!");
    return;
  }

  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    return;
  }

  let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  // Remove by email (unique)
  allUsers = allUsers.filter(user => user.email !== loggedInUser.email);
  localStorage.setItem("allUsers", JSON.stringify(allUsers));

  localStorage.removeItem("loggedInUser");

  alert("Account deleted successfully.");
  window.location.href = "landingpage.html";
}
