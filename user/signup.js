

let correctAnswer = 0;

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  correctAnswer = num1 + num2;
  document.getElementById("captcha-question").textContent = `${num1} + ${num2} = ?`;
  document.getElementById("math-answer").value = "";
  document.getElementById("captcha-error").style.display = "none";
}

// Refresh CAPTCHA when button clicked
document.getElementById("captcha-refresh").addEventListener("click", generateCaptcha);

// Validate CAPTCHA in login/signup function
function validateCaptcha() {
  const userAnswer = parseInt(document.getElementById("math-answer").value);
  if (userAnswer !== correctAnswer) {
    document.getElementById("captcha-error").style.display = "block";
    return false;
  }
  resultBox.style.color = "green";
  resultBox.textContent = "Correct! Redirecting...";
  return true;
  
  setTimeout(() => {
      window.location.href = "../../Frontend/user_home.html"; // Change to your real user home page
    }, 1000);
}

// Call this before submitting form
function handleSubmit() {
  if (!validateCaptcha()) return;

  // Your Supabase signup logic here
}

