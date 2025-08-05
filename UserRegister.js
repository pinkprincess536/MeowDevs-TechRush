// Initialize Supabase
const supabaseUrl = "https://owffebbhgkktxfcxcfdq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw";
const supaBase = supabase.createClient(supabaseUrl, supabaseKey);

// Registration handler
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById("pn").value;
    const email = document.getElementById("em").value;
    const password = document.getElementById("ps").value;
    
    try {

        const  {data,error}=await supaBase.from('UserRegistration').insert([
    {
            email:email,
            phone:phone,
            password:password

    
    }]);


    if (error) throw error;
    alert("✅ Registered successfully!Redirecting to login page..");
    
    

        e.target.reset();
        
        
        setTimeout(() => window.location.href = "UserLogin.html", 500);
        
    } 

    catch (error) 
    {
        alert("❌ Error: " + error.message);
        console.error("Registration error:", error);
    }
});