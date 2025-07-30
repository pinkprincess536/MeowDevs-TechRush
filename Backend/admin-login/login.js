const supabase = window.supabase.createClient("https://sqyofqsgggixjkklperv.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeW9mcXNnZ2dpeGpra2xwZXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTA1NTksImV4cCI6MjA2OTM4NjU1OX0.eRK5h6tH9R_VP0blv8xsH8i54sXZCnOJlSvyeQ3jHmA");

console.log("Script running");

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Trying to log in:", email);

  const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
    console.error("Login error:", loginError.message);
    document.getElementById("error-msg").textContent = loginError.message;
    return;
  }

  console.log("Logged in:", authData.user.id);

  const { data: userDetails, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (roleError) {
    console.error("Role fetch error:", roleError.message);
    document.getElementById("error-msg").textContent = "Couldn't verify admin access.";
    return;
  }

  if (userDetails.role !== "admin") {
    console.warn("Access denied for role:", userDetails.role);
    document.getElementById("error-msg").textContent = "Access denied: Not an admin.";
    return;
  }

  console.log("Access granted. Redirecting...");
  window.location.href = "dashboard.html";
});
