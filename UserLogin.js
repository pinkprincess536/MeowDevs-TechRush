const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supaBase = supabase.createClient(supabaseUrl, supabaseKey);




document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      //Query the userRegister table for matching email
      const { data: users, error } = await supaBase
        .from('UserRegistration')
        .select('email, password')
        .eq('email', email)
        .maybeSingle();
      
      if (error || !users) {
        console.log(error);
        alert('Invalid email or password');
        return;
      }

      // Try this query to see if RLS is blocking you
// const { data, error } = await supaBase
//   .from('UserRegistration')
//   .select('*')
//   .limit(1);
  
// if (error) console.error("RLS or permissions error:", error);
// else
// {
//   console.log("You have rls permissions")
// return
// }

      
      



      if (password === users.password) 
      {
        console.log('Login successful');
        alert('Login successful! Redirecting...');
        localStorage.setItem('email', email);
       location.replace ( 'User-Dash-Board.html'); // Change to user ka desired page
      } 
      else 
        {
        console.log('Incorrect password');
        alert('Invalid email or password');
        }
    
      } 
    catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  });
});