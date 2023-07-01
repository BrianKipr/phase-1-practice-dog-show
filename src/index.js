// index.js
document.addEventListener('DOMContentLoaded', function () {
    // Fetch registered dogs on page load
    fetch('http://localhost:3000/dogs')
      .then(function (response) {
        return response.json();
      })
      .then(function (dogs) {
        // Render the dogs in the table
        renderDogsTable(dogs);
      });
  
    // Add event listener to table for handling edit button clicks
    var table = document.querySelector('table');
    table.addEventListener('click', handleEditButtonClick);
  
    // Handle form submission
    document.getElementById('dog-form').addEventListener('submit', handleFormSubmit);
  });
  
  function renderDogsTable(dogs) {
    var tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
  
    dogs.forEach(function (dog) {
      var row = document.createElement('tr');
      row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class="edit-button" data-dog-id="${dog.id}">Edit</button></td>
      `;
  
      tableBody.appendChild(row);
    });
  }
  function handleEditButtonClick(event) {
    if (event.target.classList.contains('edit-button')) {
      var dogId = event.target.dataset.dogId;
  
      // Fetch dog details for the selected dog
      fetch(`http://localhost:3000/dogs/${dogId}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (dog) {
          // Populate form fields with the selected dog's information
          var form = document.getElementById('dog-form');
          form.elements.name.value = dog.name;
          form.elements.breed.value = dog.breed;
          form.elements.sex.value = dog.sex;
          form.dataset.dogId = dog.id; // Store dog ID in the form's dataset for later use
        });
    }
  }
  
  function handleFormSubmit(event) {
    // Prevent submission
    event.preventDefault(); 
  
    var form = event.target;
    var dogId = form.dataset.dogId;
    var name = form.elements.name.value;
    var breed = form.elements.breed.value;
    var sex = form.elements.sex.value;
  
    // Send a PATCH request to update the dog information
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, breed: breed, sex: sex }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        // Fetch updated dog list and render the table
        fetch('http://localhost:3000/dogs')
          .then(function (response) {
            return response.json();
          })
          .then(function (dogs) {
            renderDogsTable(dogs);
          });
      });
  
    // Reset the form
    form.reset();
    delete form.dataset.dogId;
  }
  