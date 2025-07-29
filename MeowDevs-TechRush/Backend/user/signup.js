let captchaSum = 0;

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  captchaSum = num1 + num2;
  document.getElementById("captcha-question").textContent = `What is ${num1} + ${num2}?`;
}
