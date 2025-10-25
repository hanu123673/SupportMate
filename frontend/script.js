// script.js

const form = document.getElementById('bookingForm');
const confirmation = document.getElementById('confirmation');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const service = document.getElementById('service').value;
  const hours = document.getElementById('hours').value;
  const aadhaar = document.getElementById('aadhaar').files[0];

  if (!name || !gender || !service || !hours || !aadhaar) {
    confirmation.textContent = '❌ Please fill all fields and upload Aadhaar.';
    confirmation.style.color = 'red';
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('gender', gender);
  formData.append('service', service);
  formData.append('hours', hours);
  formData.append('aadhaar', aadhaar);

  try {
    const response = await fetch('http://localhost:5000/book', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    confirmation.textContent = data.message;
    confirmation.style.color = data.message.includes('✅') ? 'green' : 'red';

    if (data.message.includes('✅')) {
      form.reset(); // Clear the form after successful booking
    }
  } catch (error) {
    console.error(error);
    confirmation.textContent = '❌ Something went wrong. Try again later.';
    confirmation.style.color = 'red';
  }
});
