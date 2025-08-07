const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let dashboardStats = {
  totalUsers: 0,
  totalNGOs: 0,
  outstandingNGORequests: 0,
  outstandingUserRequests: 0
};

async function loadDashboardStats() {
  const { data: userData } = await supabase
    .from('requests')
    .select('username')
    

  if (userData) {
    const uniqueUsers = [...new Set(userData.map(req => req.username))];
    dashboardStats.totalUsers = uniqueUsers.length;
  }

  const { data: ngoData } = await supabase
    .from('RegisterNGO')
    .select('id');

  if (ngoData) {
    dashboardStats.totalNGOs = ngoData.length;
  }

  const { data: pendingNGOData } = await supabase
    .from('ngo-requests')
    .select('id')
    .eq('status', 'pending');

  if (pendingNGOData) {
    dashboardStats.outstandingNGORequests = pendingNGOData.length;
  }

  const { data: pendingUserData } = await supabase
    .from('requests')
    .select('id')
    .eq('status', 'pending');

  if (pendingUserData) {
    dashboardStats.outstandingUserRequests = pendingUserData.length;
  }

  updateDashboardCards();
}

function updateDashboardCards() {
  const totalUsersElement = document.getElementById('total-users');
  const totalNGOsElement = document.getElementById('total-ngos');
  const outstandingNGORequestsElement = document.getElementById('outstanding-ngo-requests');
  const outstandingUserRequestsElement = document.getElementById('outstanding-user-requests');
  
  if (totalUsersElement) {
    totalUsersElement.textContent = dashboardStats.totalUsers;
  }
  
  if (totalNGOsElement) {
    totalNGOsElement.textContent = dashboardStats.totalNGOs;
  }
  
  if (outstandingNGORequestsElement) {
    outstandingNGORequestsElement.textContent = dashboardStats.outstandingNGORequests;
  }
  
  if (outstandingUserRequestsElement) {
    outstandingUserRequestsElement.textContent = dashboardStats.outstandingUserRequests;
  }
}

async function loadRequests() {
  const { data } = await supabase
    .from('ngo-requests')
    .select('id, created_at, ngo_id, status')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(3);

  renderRequests(data || []);
}

function renderRequests(requests) {
  const list = document.getElementById('request-list');
  list.innerHTML = '';

  if (requests.length === 0) {
    list.innerHTML = '<div class="no-requests">No outstanding requests at the moment.</div>';
    return;
  }

  requests.forEach(req => {
    const item = document.createElement('div');
    item.className = 'request-item';
   
    item.innerHTML = `
      <div class="request-title">Request #${req.id}</div>
      <div class="request-meta">
        👤 NGO: ${req.ngo_id}
        <span class="tag">${req.status}</span>
        <span class="tag">${new Date(req.created_at).toLocaleDateString()}</span>
      </div>
    `;

    list.appendChild(item);
  });
}

supabase
  .channel('dashboard-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'ngo-requests'
  }, () => {
    loadDashboardStats();
    loadRequests();
  })
  .subscribe();

supabase
  .channel('user-requests-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'requests'
  }, () => {
    loadDashboardStats();
  })
  .subscribe();

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
  loadRequests();
});

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.getElementById(tabId).style.display = 'block';
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}