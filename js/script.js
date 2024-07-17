document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const container = document.getElementById('container');
    const mainContent = document.getElementById('main-content');
    const errorDiv = document.getElementById('error');
    const successful = document.getElementById('img');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'Admin12345') {
            errorDiv.style.display = 'none';
            successful.style.display = 'block';
            container.style.display = 'none';

            setTimeout(() => {
                successful.style.display = 'none';
                mainContent.style.display = 'flex';
            }, 3000);
        } else {
            errorDiv.style.display = 'block';
        }
    });

    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('home').addEventListener('click', showHome);
    document.getElementById('vehicle-prices').addEventListener('click', showVehiclePrices);
    document.getElementById('spare-prices').addEventListener('click', showSparePrices);
    document.getElementById('user-creation').addEventListener('click', showUserCreation);

    fetchData();
});

let vehicles = [];
let spares = [];

function fetchData() {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            vehicles = data.vehicles;
            spares = data.spares;
        })
        .catch(error => console.error('Error fetching data:', error));
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

function showHome() {
    const content = document.getElementById('content');
    content.classList.add('home-content');
    content.innerHTML = `
        <h2>Welcome to the Vehicle Catalogue</h2>
        <p>Select an option from the sidebar to begin.</p>
    `;
}

function showVehiclePrices() {
    const content = document.getElementById('content');
    content.classList.add('vehi-content');
    content.innerHTML = `
        <h2>Vehicle Prices</h2>
        <input type="text" id="vehicleSearch" placeholder="Search Vehicles" onkeyup="searchVehicles()" onfocus="this.value = ''">
        <div id="vehicleResults"></div>
    `;
}

function showSparePrices() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Spare Part Prices</h2>
        <input type="text" id="spareSearch" placeholder="Search Spare Parts" onkeyup="searchSpares()">
        <div id="spareResults"></div>
    `;
}

function showUserCreation() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>User Creation</h2>
        <form id="userForm">
            <input type="text" id="name" placeholder="Name" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="text" id="phone" placeholder="Phone" required>
            <input type="button" class="pass" onclick="randomPass()" value="Generate Password">
            <button type="button" onclick="addToList()">Add User</button>
        </form>
        <ul id="userList"></ul>
    `;
}

function randomPass() {
    const password = Math.random().toString(36).slice(-4);
    alert(`Generated Password: ${password}`);
}

function searchVehicles() {
    const query = document.getElementById('vehicleSearch').value.toLowerCase();
    const vehicleResults = document.getElementById('vehicleResults');
    vehicleResults.innerHTML = ''; 

    if (query === '') {
        return;
    }

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.year.includes(query)
    );
    displayVehicles(filteredVehicles);
}

function searchSpares() {
    const query = document.getElementById('spareSearch').value.toLowerCase();
    const spareResults = document.getElementById('spareResults');
    spareResults.innerHTML = ''; 

    if (query === '') {
        return;
    }

    const filteredSpares = spares.filter(spare =>
        spare.brand.toLowerCase().includes(query) ||
        spare.model.toLowerCase().includes(query) ||
        spare.year.includes(query)
    );
    displaySpares(filteredSpares);
}

function displayVehicles(filteredVehicles) {
    const vehicleResults = document.getElementById('vehicleResults');
    vehicleResults.innerHTML = ''; 

    filteredVehicles.forEach(vehicle => {
        const vehicleElement = document.createElement('div');
        vehicleElement.className = 'vehicle';
        vehicleElement.innerHTML = `
            <h3 onclick="showPopup(${vehicle.Id}, 'vehicle')">${vehicle.brand} ${vehicle.model} (${vehicle.year})</h3>
            <p>Type: ${vehicle.type}</p>
            <p>Shop: ${vehicle.shop}</p>
        `;
        
        vehicleResults.appendChild(vehicleElement);
    });
}

function displaySpares(filteredSpares) {
    const spareResults = document.getElementById('spareResults');
    spareResults.innerHTML = ''; 

    filteredSpares.forEach(spare => {
        const spareElement = document.createElement('div');
        spareElement.className = 'vehicle';
        spareElement.innerHTML = `
            <h3 onclick="showPopup(${spare.Id}, 'spare')">${spare.brand} ${spare.model} (${spare.year})</h3>
            <p>Type: ${spare.type}</p>
        `;
        spareResults.appendChild(spareElement);
    });
}

function populateDropdown(categoryId, parts) {
    const dropdown = document.getElementById(categoryId);
    dropdown.innerHTML = '';
    if (parts && parts.length) {
        parts.forEach(part => {
            const option = document.createElement('option');
            option.value = part.partNumber;
            option.textContent = part.partName;
            dropdown.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.textContent = 'No parts available';
        dropdown.appendChild(option);
    }
}

function showPopup(itemId, type) {
    if (type === 'vehicle') {
        const vehicle = vehicles.find(v => v.Id === itemId.toString());
        if (vehicle) {
            document.getElementById('popupImage').src = `images/${vehicle.image}`;
            document.getElementById('popupName').textContent = `${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
            document.getElementById('popupSpecs').textContent = `Type: ${vehicle.type}`;
            document.getElementById('popupPrice').textContent = `Price: Ksh: ${getRandomPrice()}`;
            document.getElementById('popupShop').textContent = `Shop: ${vehicle.shop || 'Not available'}`;

            document.getElementById('popup').style.display = 'flex';
            document.getElementById('popup').style.flexDirection = 'column';
        }
    } else if (type === 'spare') {
        const spare = spares.find(s => s.Id === itemId.toString());

        if (spare) {
            const vehicleSpares = spares.find(s => 
                s.brand === spare.brand && 
                s.model === spare.model && 
                s.year === spare.year
            );

            if (vehicleSpares) {
                populateDropdown('mechanical', vehicleSpares.categories.mechanical);
                populateDropdown('interior', vehicleSpares.categories.interior);
                populateDropdown('individualBodyParts', vehicleSpares.categories.individualBodyParts);
                populateDropdown('bodyPartAssemblies', vehicleSpares.categories.bodyPartAssemblies);
            } else {
                populateDropdown('mechanical', []);
                populateDropdown('interior', []);
                populateDropdown('individualBodyParts', []);
                populateDropdown('bodyPartAssemblies', []);
            }

            document.getElementById('sparePopup').style.display = 'flex';
            document.getElementById('sparePopup').style.flexDirection = 'column';
        }
    }
    
}

function closePopup(type) {
    if (type === 'vehicle') {
        document.getElementById('popup').style.display = 'none';
    } else if (type === 'spare') {
        document.getElementById('sparePopup').style.display = 'none';
    }
}

function getRandomPrice() {
    return (Math.random() * (5000000 - 2000000) + 2000000).toFixed(2);
}

function addToList() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || phoneInput.value.trim() === '') {
        alert('Please fill in all fields');
        return;
    }
    
    const userList = document.getElementById('userList');
    const newUserItem = document.createElement('li');
    newUserItem.className = 'user-item';

    const userInfoDiv = document.createElement('div');
    userInfoDiv.className = 'user-info';
    userInfoDiv.textContent = `Name: ${nameInput.value}, Email: ${emailInput.value}, Phone: ${phoneInput.value}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        userList.removeChild(newUserItem);
    });
    
    newUserItem.appendChild(userInfoDiv);
    newUserItem.appendChild(deleteBtn);

    userList.appendChild(newUserItem);

    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
}

function searchParts() {
    const mechanical = document.getElementById('mechanical').value;
    const interior = document.getElementById('interior').value;
    const individualBodyParts = document.getElementById('individualBodyParts').value;
    const bodyPartAssemblies = document.getElementById('bodyPartAssemblies').value;

    const selectedParts = [mechanical, interior, individualBodyParts, bodyPartAssemblies].filter(part => part !== '');

    if (selectedParts.length === 0) {
        alert('Please select at least one part.');
        return;
    }

    const partsResults = document.getElementById('partsResults');
    partsResults.innerHTML = ''; // Clear previous results

    selectedParts.forEach(partNumber => {
        const part = spares.flatMap(s => s.categories).flatMap(cat => Object.values(cat)).find(p => part.partNumber === partNumber);

        if (part) {
            const card = document.createElement('div');
            card.className = 'part-card';

            const img = document.createElement('img');
            img.src = `images/${part.image}`;
            img.alt = part.partName;
            img.className = 'part-image';

            const details = document.createElement('div');
            details.className = 'part-details';
            details.innerHTML = `
                <h3>${part.partName}</h3>
                <p>Price: Ksh ${getRandomPrice()}</p>
                <p>Shop: ${part.shop || 'Not available'}</p>
            `;

            card.appendChild(img);
            card.appendChild(details);
            partsResults.appendChild(card);

            // Optional: Add click functionality to show details in a popup or modal
            card.addEventListener('click', () => showPartDetails(part));
        }
    });

    // Show the parts results
    partsResults.style.display = 'flex';

    // Hide the spare popup
    closePopup('spare');
}



function showPartDetails(part) {
    document.getElementById('partPopupImage').src = `images/${part.image}`;
    document.getElementById('partPopupName').textContent = part.partName;
    document.getElementById('partPopupPrice').textContent = `Price: Ksh: ${getRandomPrice()}`;
    document.getElementById('partPopupShop').textContent = `Shop: ${part.shop || 'Not available'}`;

    document.getElementById('partPopup').style.display = 'flex';
    document.getElementById('partPopup').style.flexDirection = 'column';
}
