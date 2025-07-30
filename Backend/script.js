const supabase = window.supabase.createClient(
  "https://sqyofqsgggixjkklperv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeW9mcXNnZ2dpeGpra2xwZXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTA1NTksImV4cCI6MjA2OTM4NjU1OX0.eRK5h6tH9R_VP0blv8xsH8i54sXZCnOJlSvyeQ3jHmA"
);

async function fetchRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('request-list');
  list.innerHTML = "";

  if (data) {
    data.forEach((req) => {
      const item = document.createElement('li');
      item.textContent = `${req.title}: ${req.description} [${req.status}]`;
      list.appendChild(item);
    });
  }
}

document.getElementById('request-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  const { error } = await supabase.from('requests').insert([
    {
      title,
      description,
      status: 'pending'
    }
  ]);

  if (!error) {
    document.getElementById('request-form').reset();
    fetchRequests();
  } else {
    alert('Error submitting request');
  }
});

fetchRequests();
