const response = await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Anton', email: 'anton@example.com' }),
});

const data = await response.json();
console.log('Response:', data);
