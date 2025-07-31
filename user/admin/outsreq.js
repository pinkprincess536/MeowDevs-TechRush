

/*const supabase = supabase.createClient('https://owffebbhgkktxfcxcfdq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw');

async function fetchRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('status', 'Pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  document.getElementById('request-count').textContent = `${data.length} requests waiting for attention`;
  renderRequests(data);
}

function renderRequests(requests) {
  const list = document.getElementById('requests-list');
  list.innerHTML = '';

  requests.forEach(req => {
    const card = document.createElement('div');
    card.className = 'request-card';

    card.innerHTML = `
      <div class="request-info">
        <div class="request-title">${req.description}</div>
        <div class="request-meta">👤 ${req.username} • ${timeAgo(req.created_at)}</div>
      </div>
      <div class="badges">
        <span class="badge category">${req.category}</span>
        <span class="badge ${getPriorityClass(req.priority)}">${req.priority}</span>
      </div>
    `;

    list.appendChild(card);
  });
}

function getPriorityClass(priority) {
  switch (priority.toLowerCase()) {
    case 'high': return 'priority-high';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return '';
  }
}

function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// Realtime subscription
supabase
  .channel('realtime-requests')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'requests' },
    payload => {
      console.log('New request:', payload.new);
      fetchRequests(); // Refresh the list
    }
  )
  .subscribe();

fetchRequests(); // Initial load
*/
// Supabase config
const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('id, username, category, status');

  if (error) {
    console.error("Error loading requests:", error.message);
    return;
  }

  renderRequests(data);
}

function renderRequests(requests) {
  const list = document.getElementById('request-list');
  list.innerHTML = '';

  document.getElementById('count').innerText = `${requests.length} requests waiting for attention`;

  requests.forEach(req => {
    const item = document.createElement('div');
    item.className = 'request-item';

    item.innerHTML = `
      <div class="request-title">Request #${req.id}</div>
      <div class="request-meta">
        👤 ${req.username}
        <span class="tag">${req.category}</span>
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
    table: 'requests'
  }, payload => {
    console.log('Realtime update:', payload);
    loadRequests();
  })
  .subscribe();

loadRequests();
