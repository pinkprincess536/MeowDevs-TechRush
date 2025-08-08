const supabaseUrl = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentRequestId = null;
let selectedNgoId = null;

async function loadRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .in('status', ['Accepted','Rejected', 'dropped off'])
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
        <div  class="tag">${req.category}</div>
        <div class="tag">${req.status}</div>
        <button class="ViewDetails" onclick="showRequestInfo('${req.id}')" >View Details</button>
      </div>
    `;

    

    list.appendChild(item);
  });
}


supabase
  .channel('requests-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'requests',
  }, payload => {
    const status = payload.new?.status;
    if (status === 'Accepted' || status === 'Rejected' || status === 'dropped off') {
      console.log(`Realtime ${status} request:`, payload);
      loadRequests();
    }
  })
  .subscribe();

async function showRequestInfo(requestId) {
 const infoBox = document.getElementById('requestInfoBox');
  
  
  infoBox.style.display = 'block';

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

  const notifyBtn = document.querySelector('.notify-ngo-btn');
  if (notifyBtn) {
    if (data.status === 'dropped off') {
      notifyBtn.style.display = 'inline-block';
    } else {
      notifyBtn.style.display = 'none';
    }
  }

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

function hideRequestInfo() {
  document.getElementById('requestInfoBox').style.display = 'none';
}

async function showNgoModal() {
  if (!currentRequestId) {
    alert("No request selected.");
    return;
  }

  const modal = document.getElementById('ngoModal');
  modal.style.display = 'block';
  
  await loadNgos();
}

function closeNgoModal() {
  const modal = document.getElementById('ngoModal');
  modal.style.display = 'none';
  selectedNgoId = null;
}

async function loadNgos() {
  const { data, error } = await supabase
    .from('RegisterNGO')
    .select('id, ngo_name, Address, email');

  if (error) {
    console.error("Error loading NGOs:", error.message);
    document.getElementById('ngoList').innerHTML = '<p style="color: red;">Error loading NGOs</p>';
    return;
  }

  renderNgos(data);
}

function renderNgos(ngos) {
  const ngoList = document.getElementById('ngoList');
  ngoList.innerHTML = '';

  if (ngos.length === 0) {
    ngoList.innerHTML = '<p>No NGOs found</p>';
    return;
  }

  ngos.forEach(ngo => {
    const ngoItem = document.createElement('div');
    ngoItem.className = 'ngo-item';
    ngoItem.onclick = () => selectNgo(ngo.id, ngoItem);
    
    ngoItem.innerHTML = `
      <div class="ngo-name">${ngo.ngo_name}</div>
      <div class="ngo-address">${ngo.Address}</div>
    `;
    
    ngoList.appendChild(ngoItem);
  });

  const assignButton = document.createElement('button');
  assignButton.textContent = 'Assign Selected NGO';
  assignButton.className = 'notify-ngo-btn';
  assignButton.onclick = assignNgoToRequest;
  assignButton.style.marginTop = '20px';
  assignButton.style.width = '100%';
  assignButton.disabled = true;
  assignButton.id = 'assignNgoBtn';
  
  ngoList.appendChild(assignButton);
}

function selectNgo(ngoId, element) {

  const allNgos = document.querySelectorAll('.ngo-item');
  allNgos.forEach(ngo => ngo.classList.remove('selected'));
  
  element.classList.add('selected');
  selectedNgoId = ngoId;
  

  const assignBtn = document.getElementById('assignNgoBtn');
  if (assignBtn) {
    assignBtn.disabled = false;
  }
}

async function assignNgoToRequest() {
  if (!selectedNgoId || !currentRequestId) {
    alert("Please select an NGO first.");
    return;
  }

  const selectedNgo = await supabase
    .from('RegisterNGO')
    .select('ngo_name, email')
    .eq('id', selectedNgoId)
    .single();

  if (!selectedNgo.data) {
    alert("Error: NGO not found.");
    return;
  }
  const { error: updateError } = await supabase
    .from('requests')
    .update({ ngo_assigned_to: selectedNgo.data.email })
    .eq('id', currentRequestId);

  if (updateError) {
    alert("Failed to assign NGO to request.");
    console.error("Supabase error:", updateError);
    return;
  }

  const { data: requestData } = await supabase
    .from('requests')
    .select('category, quantity')
    .eq('id', currentRequestId)
    .single();

  if (!requestData) {
    alert("Error: Request not found.");
    return;
  }

  const { error: insertError } = await supabase
    .from('ngo-requests')
    .insert({
      ngo_id: selectedNgo.data.email,
      category: requestData.category,
      quantity: requestData.quantity,
      description: `${requestData.description}`, 
      status: 'Accepted'
    });

  if (insertError) {
    console.error("Error creating ngo-requests entry:", insertError);
    
  }

  alert(`Successfully assigned ${selectedNgo.data.ngo_name} to Request #${currentRequestId}`);
  closeNgoModal();
  hideRequestInfo();
  loadRequests(); 
}

window.onclick = function(event) {
  const modal = document.getElementById('ngoModal');
  if (event.target === modal) {
    closeNgoModal();
  }

}
