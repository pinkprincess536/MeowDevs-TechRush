
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const errorMsg = document.getElementById('error-msg');
  errorMsg.textContent = ''; 

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login Error:", error);
    errorMsg.textContent = '❌ ' + error.message;
  } else {
    console.log("Login Success:", data);
    window.location.href = 'adminpage.html';
  }
});
