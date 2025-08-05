 
const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadRequests() {
  const { data, error } = await supabase
    .from('ngo-requests')
    .select('*')
    .eq('status', 'pending')
   

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
      <br>
      <div class="request-meta" id="req.id">
        👤 ${req.ngo_id}
        <span class="tag">${req.category}</span>
        <br>
        <span class="tag">${req.status}</span>
        <br>
        <span class="tag">${req.created_at}</span>
        <br>
        <span class="tag">${req.description}</span>
        <br>
        <span class="tag">${req.quantity}</span>
        <br>
      </div>

      <div class="buttons">
  <button onclick="updateRequestStatus(${req.id}, 'Accepted')" class="accept-btn">Accept</button>
  <button onclick="updateRequestStatus(${req.id}, 'Rejected')" class="reject-btn">Reject</button>
    `;

    

    list.appendChild(item);
  });
}

supabase
  .channel('requests-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'ngo-requests',
    filter: 'status=eq.Pending'
  }, payload => {
    console.log('Realtime update:', payload);
    loadRequests();
  })
  .subscribe();
  
loadRequests();



async function updateRequestStatus(requestId, newStatus) {
  if (!requestId) {
    alert("No request selected.");
    return;
  }

  const { error } = await supabase
    .from('ngo-requests')
    .update({ status: newStatus })
    .eq('id', requestId);

  if (error) {
    alert("Failed to update status.");
    console.error("Supabase error:", error);
  } else {
    alert(`Request marked as ${newStatus}`);
    // Optionally hide info box if present
    const infoBox = document.getElementById('requestInfoBox');
    if (infoBox) infoBox.classList.remove('show');
    loadRequests();
  }
}
