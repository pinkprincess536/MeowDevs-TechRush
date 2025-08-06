const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentRequestId = null;

async function loadRequests() {

  const { data: userData, error: userError } = await supabase
    .from('requests')
    .select('*')
    .in('status', ['Accepted', 'Rejected','dropped off']);


  const { data: ngoData, error: ngoError } = await supabase
    .from('ngo-requests')
    .select('*')
    .in('status', ['Accepted', 'Rejected']);

  if (userError || ngoError) {
    console.error("Error loading requests:", userError?.message, ngoError?.message);
    return;
  }

  renderUserRequests(userData);
  renderNgoRequests(ngoData);
}

function renderUserRequests(requests) {
  const box = document.getElementById('requestsBox1');
  box.innerHTML = '';
  requests.forEach(req => {
    const div = document.createElement('div');
    div.className = 'request-card';
    div.innerHTML = `
      <p><strong>Username:</strong> ${req.username}</p>
      <p><strong>Category:</strong> ${req.category}</p>
      <p><strong>Status:</strong> ${req.status}</p>
      <button onclick="showUserRequestInfo(${req.id})">View Details</button>
    `;
    box.appendChild(div);
  });
}

function renderNgoRequests(requests) {
  const box = document.getElementById('requestsBox2');
  box.innerHTML = '';
  requests.forEach(req => {
    const div = document.createElement('div');
    div.className = 'request-card';
    div.innerHTML = `
      <p><strong>NGO:</strong> ${req.ngo_name || req.ngo_id}</p>
      <p><strong>Category:</strong> ${req.category}</p>
      <p><strong>Status:</strong> ${req.status}</p>
      <button onclick="showNgoRequestInfo(${req.id})">View Details</button>
    `;
    box.appendChild(div);
  });
}

async function showUserRequestInfo(requestId) {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('id', requestId)
    .in('status', ['Accepted', 'Rejected'])
    .single();

  if (error) {
    console.error("Error loading user request info:", error.message);
    return;
  }

  currentRequestId = requestId;
  document.getElementById('infoTitle').textContent = `User Request #${requestId}`;
  document.getElementById('infoSubtitle').textContent = 'Request information';
  document.getElementById('username').textContent = data.username;
  document.getElementById('category').textContent = data.category;
  document.getElementById('quantity').textContent = data.quantity;
  document.getElementById('requestInfoBox').style.display = 'block';

  loadRequestImageUrl(data.image_url); 

async function showNgoRequestInfo(requestId) {
  const { data, error } = await supabase
    .from('ngo-requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (error) {
    console.error("Error loading NGO request info:", error.message);
    return;
  }

  currentRequestId = requestId;
  document.getElementById('infoTitle').textContent = `NGO Request #${requestId}`;
  document.getElementById('infoSubtitle').textContent = 'NGO request details';
  document.getElementById('username').textContent = data.ngo_name || data.ngo_id;
  document.getElementById('category').textContent = data.category;
  document.getElementById('quantity').textContent = data.quantity;
  document.getElementById('requestInfoBox').style.display = 'block';

 
}

function loadRequestImageUrl(imagePath) {
  if (imagePath) {
    document.getElementById('urlContainer').innerHTML = `
      <img src="${imagePath}" alt="Request Image" style="max-width: 200px; height: auto,object-fit:contain;" />
    `;
  } 
}

supabase.channel('requests-updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, payload => {
    const status = payload.new?.status;
    if (['Accepted', 'Rejected'].includes(status)) {
      console.log(`Realtime USER request update:`, payload);
      loadRequests();
    }
  })
  .subscribe();

supabase.channel('ngo-requests-updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'ngo-requests' }, payload => {
    const status = payload.new?.status;
    if (['Accepted', 'Rejected'].includes(status)) {
      console.log(`Realtime NGO request update:`, payload);
      loadRequests();
    }
  })
  .subscribe();

window.addEventListener('DOMContentLoaded', () => {
  loadRequests();
});
