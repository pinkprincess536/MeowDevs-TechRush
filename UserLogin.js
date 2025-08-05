const supabaseUrl = 'https://ryvnzfjbgyruzvdqhpaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dm56ZmpiZ3lydXp2ZHFocGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTM5MDEsImV4cCI6MjA2OTUyOTkwMX0.V1taV5QIOa4s2XROp6dp3ywmnHFkSy55j3lAJpcEUzk';
const supaBase = supabase.createClient(supabaseUrl, supabaseKey);




document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      // Query the userRegister table for matching email
      const { data: users, error } = await supaBase
        .from('UserRegistration')
        .select('email, password')
        .eq('email', email)
        .single();
      
      if (error || !users) {
        console.log('User not found');
        alert('Invalid email or password');
        return;
      }
      
      



      if (password === users.password) 
        {
        console.log('Login successful');
        alert('Login successful! Redirecting...');
        window.location.href = 'dashboard.html'; // Change to your desired page
      } else {
        console.log('Incorrect password');
        alert('Invalid email or password');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  });
});