


let currentRequestId = null;
const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('status', 'pending')
    .order('id', { ascending: false });
   

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
        <button class="ViewDetails" onclick="showRequestInfo('${req.id}')" >View Details</button>
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
    table: 'requests',
    filter: 'status=eq.Pending'
  }, payload => {
    console.log('Realtime update:', payload);
    loadRequests();
  })
  .subscribe();
  
loadRequests();




async function showRequestInfo(requestId) {

  currentRequestId = requestId;
  document.getElementById('requestInfoBox').classList.add('show');

  document.getElementById('infoTitle').textContent = `Request #${requestId}`;
  document.getElementById('infoSubtitle').textContent = 'Loading request details...';

  const { data } = await supabase
    .from('requests')
    .select('*')
    .eq('id', requestId)
    .single();

  document.getElementById('infoSubtitle').textContent = 'Request information';
  document.getElementById('username').textContent = data.username;
  document.getElementById('category').textContent = data.category;
  document.getElementById('quantity').textContent = data.quantity;

  loadRequestImageUrl(data.image_url);

  async function loadRequestImageUrl(imagePath) {
   
    document.getElementById('urlContainer').innerHTML = `
      <img src="${imagePath}" alt="Request Image" style="max-width: 100%; height: auto;"/>
     
    `;
  }
}

loadRequests();



async function updateRequestStatus(newStatus) {
  if (!currentRequestId) {
    alert("No request selected.");
    return;
  }

  const { error } = await supabase
    .from('requests')
    .update({ status: newStatus })
    .eq('id', currentRequestId);

  if (error) {
    alert("Failed to update status.");
    console.error("Supabase error:", error);
  } else {
    alert(`Request marked as ${newStatus}`);
    document.getElementById('requestInfoBox').classList.remove('show');
    loadRequests();
  }
}
