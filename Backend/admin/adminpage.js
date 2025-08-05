
const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadRequests() {
  const { data, error } = await supabase
    .from('ngo-requests')
    .select('id, created_at, ngo_id, status');

  if (error) {
    console.error("Error loading requests:", error.message);
    return;
  }

  renderRequests(data);
}

function renderRequests(requests) {
  const list = document.getElementById('request-list');
  list.innerHTML = '';
const topthree=requests.slice(0,3);


  topthree.forEach(req => {
    const item = document.createElement('div');
    item.className = 'request-item';
   
    item.innerHTML = `
      <div class="request-title">Request #${req.id}</div>
      <div class="request-meta">
        👤 ${req.category}
        <span class="tag">${req.description}</span>
        <span class="tag">${req.created_at}</span>
        <span class="tag">${req.status}</span>
      </div>
    `;

    

    list.appendChild(item);
  });
}

// Real-time updates
supabase
  .channel('requests-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'ngrequests'
  }, payload => {
    console.log('Realtime update:', payload);
    loadRequests();
  })
  .subscribe();

loadRequests();

function showTab(tabId) {
    // Hide all content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show selected content
    document.getElementById(tabId).style.display = 'block';
    
    // Update active state
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

