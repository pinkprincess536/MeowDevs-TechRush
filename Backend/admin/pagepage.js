import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://owffebbhgkktxfcxcfdq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZmZlYmJoZ2trdHhmY3hjZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjgwMTcsImV4cCI6MjA2OTMwNDAxN30.7Q20V6cP_iFM7ojsD1xoKWqgj1VUe1syITi9gjxQpbw';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 

/*

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('requestForm');

  document.getElementById('submit-btn').addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const category = document.getElementById('category').value;
  const imageFile = document.getElementById('image').files[0];

  if (!imageFile) {
    alert('Please choose an image');
    return;
  }

  const fileExt = imageFile.name.split('.').pop();
  const filePath = `uploads/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error(uploadError);
    alert('Image upload failed.');
    return;
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('item-images')
    .getPublicUrl(filePath);
  
  const imageUrl = publicUrlData.publicUrl;

  // Save form data to Supabase table
  const { error: insertError } = await supabase
    .from('requests')
    .insert([{ username, category, image_url: imageUrl }]);

  if (insertError) {
    console.error(insertError);
    alert('Error saving request.');
  } else {
    alert('Request submitted successfully!');
    document.getElementById('request-form').reset();
  }
  });
});

*/


