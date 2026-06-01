// -----------------------------
// ROLE SELECTION
// -----------------------------
function setRole(role) {
  localStorage.setItem("selectedRole", role);
}

// -----------------------------
// TENANT REGISTRATION
// -----------------------------
async function signUp() {
  const firstName = document.getElementById("first-name").value;
  const middleName = document.getElementById("middle-name")?.value || "";
  const lastName = document.getElementById("last-name").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (!firstName || !lastName || !email || !password) {
    alert("Please fill out all required fields.");
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        address: address,
        email: email,
        phone: phone,
        password: password,
        role: 'tenant'
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("verifyEmail", email);
      alert("Registration successful! Please check your email for the OTP.");
      window.location.href = "verify.html";
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server. Make sure your backend is running!");
    console.error(err);
  }
}

// -----------------------------
// OWNER REGISTRATION
// -----------------------------
async function signUpOwner() {
  const firstName = document.getElementById("first-name").value;
  const middleName = document.getElementById("middle-name")?.value || "";
  const lastName = document.getElementById("last-name").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (!firstName || !lastName || !email || !password) {
    alert("Please fill out all required fields.");
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        address: address,
        email: email,
        phone: phone,
        password: password,
        role: 'owner'
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("verifyEmail", email);
      alert("Registration successful! Please check your email for the OTP.");
      window.location.href = "verify.html";
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server. Make sure your backend is running!");
    console.error(err);
  }
}

// -----------------------------
// LOGIN FUNCTION
// -----------------------------
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      if (data.user.role === "owner") {
        window.location.href = "OWnerPRofile.html";
      } else {
        window.location.href = "Customerprofile.html";
      }

    } else {
      if (data.error.includes('verify your email')) {
        localStorage.setItem("verifyEmail", email);
        alert("Your email is not verified yet! We'll send you a new OTP code.");

        await fetch('https://housefinds-backend.up.railway.app/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        window.location.href = "verify.html";
      } else {
        alert("Error: " + data.error);
      }
    }

  } catch (err) {
    alert("Could not connect to server. Make sure your backend is running!");
    console.error(err);
  }
}

// -----------------------------
// OTP VERIFICATION
// -----------------------------
async function verifyOTP() {
  const email = localStorage.getItem("verifyEmail");
  const otp = document.getElementById("otp").value;

  if (!otp) {
    alert("Please enter the OTP code.");
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Email verified successfully! You can now log in.");
      localStorage.removeItem("verifyEmail");
      window.location.href = "Selectingpage.html";
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server. Make sure your backend is running!");
    console.error(err);
  }
}

// -----------------------------
// RESEND OTP
// -----------------------------
async function resendOTP() {
  const email = localStorage.getItem("verifyEmail");

  if (!email) {
    alert("Session expired. Please register again.");
    window.location.href = "Selectingpage.html";
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      alert("New OTP sent! Please check your email.");
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server.");
    console.error(err);
  }
}

// -----------------------------
// LOAD PROFILE
// -----------------------------
function loadProfile() {
  const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!savedUser) return;

  const nameElem = document.querySelector(".name");
  const roleElem = document.querySelector(".role");
  const aboutElem = document.querySelector(".about-info");
  const welcomeElem = document.querySelector(".welcome");

  if (nameElem) {
    nameElem.textContent = `${savedUser.first_name} ${savedUser.last_name}`;
  }

  if (roleElem) {
    roleElem.textContent = savedUser.role === "owner" ? "Owner" : "Customer";
  }

  if (aboutElem) {
    aboutElem.innerHTML = `
      Address: ${savedUser.address}<br><br>
      Email: ${savedUser.email}<br><br>
      Phone: ${savedUser.phone}<br><br>
      Role: ${savedUser.role}
    `;
  }

  if (welcomeElem) {
    welcomeElem.textContent = `Welcome, ${savedUser.first_name}!`;
  }
}

// -----------------------------
// LOGOUT
// -----------------------------
function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("token");
  window.location.href = "landingpage.html";
}

// -----------------------------
// DELETE ACCOUNT
// -----------------------------
async function deleteAccount() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("No user is currently logged in!");
    return;
  }

  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    return;
  }

  try {
    const response = await fetch(`https://housefinds-backend.up.railway.app/api/auth/delete/${loggedInUser.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    });

    if (response.ok) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token");
      alert("Account deleted successfully.");
      window.location.href = "landingpage.html";
    } else {
      alert("Failed to delete account.");
    }

  } catch (err) {
    alert("Could not connect to server.");
    console.error(err);
  }
}

// -----------------------------
// FORGOT PASSWORD
// -----------------------------
async function forgotPassword() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("resetEmail", email);
      alert("Reset code sent! Please check your email.");
      window.location.href = "reset-otp.html";
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server. Make sure your backend is running!");
    console.error(err);
  }
}

// -----------------------------
// VERIFY RESET OTP
// -----------------------------
async function verifyResetOTP() {
  const email = localStorage.getItem("resetEmail");
  const otp = document.getElementById("reset-otp").value;

  if (!otp) {
    alert("Please enter the reset code.");
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/verify-reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Code verified! Now set your new password.");
      window.location.href = "reset-password.html";
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server.");
    console.error(err);
  }
}

// -----------------------------
// RESEND RESET OTP
// -----------------------------
async function resendResetOTP() {
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    alert("Session expired. Please try again.");
    window.location.href = "forgot-password.html";
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      alert("New reset code sent! Please check your email.");
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server.");
    console.error(err);
  }
}

// -----------------------------
// RESET PASSWORD
// -----------------------------
async function resetPassword() {
  const email = localStorage.getItem("resetEmail");
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!newPassword || !confirmPassword) {
    alert("Please fill in both password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match! Please try again.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    const response = await fetch('https://housefinds-backend.up.railway.app/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Password reset successful! You can now log in.");
      localStorage.removeItem("resetEmail");
      window.location.href = "Selectingpage.html";
    } else {
      alert("Error: " + data.error);
    }

  } catch (err) {
    alert("Could not connect to server.");
    console.error(err);
  }
}