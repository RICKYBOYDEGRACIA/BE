fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
      "firstName": "Ricky Boy",
      "middleName": "Gabiola",
      "lastName": "De Gracia",
      "age": 26,
      "email": "ricky@example.com",
      "password": "securePassword123",
      "location": {
        "city": "CITY OF PASIG",
        "barangay": "Kalawaan"
      }
    })
})
  .then(response => response.json())
  .then(data => console.log(data));   