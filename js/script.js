document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const container = document.getElementById("container");
    const mainContent = document.getElementById("main-content");
    const errorDiv = document.getElementById("error");
    const successful = document.getElementById("img");
  
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      if (username === "admin" && password === "Admin12345") {
        errorDiv.style.display = "none";
        successful.style.display = "block";
        container.style.display = "none";
  
        setTimeout(() => {
          successful.style.display = "none";
          mainContent.style.display = "flex";
        }, 3000);
      } else {
        errorDiv.style.display = "block";
      }
    });
  
    document.getElementById("logout").addEventListener("click", logout);
    document.getElementById("home").addEventListener("click", showHome);
    document
      .getElementById("vehicle-prices")
      .addEventListener("click", showVehiclePrices);
    document
      .getElementById("spare-prices")
      .addEventListener("click", showSparePrices);
    document
      .getElementById("user-creation")
      .addEventListener("click", showUserCreation);
  
    fetchData();
  });
  
  let vehicles = [];
  let spares = [];
  
  function fetchData() {
    fetch("db.json")
      .then((response) => response.json())
      .then((data) => {
        vehicles = data.vehicles;
        spares = data.spares;
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
  
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "index.html";
    }
  }
  
  function showHome() {
    document.getElementById("homeContent").style.display = "block";
    document.getElementById("vehiclePricesContent").style.display = "none";
    document.getElementById("sparePricesContent").style.display = "none";
    document.getElementById("userCreationContent").style.display = "none";
  }
  
  function showVehiclePrices() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("vehiclePricesContent").style.display = "block";
    document.getElementById("sparePricesContent").style.display = "none";
    document.getElementById("userCreationContent").style.display = "none";
    
    const spareResults = document.getElementById("spareResults");
    spareResults.innerHTML = "";
    document.getElementById("selectedImages").innerHTML = "";
  }
  
  
  function showSparePrices() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("vehiclePricesContent").style.display = "none";
    document.getElementById("sparePricesContent").style.display = "block";
    document.getElementById("userCreationContent").style.display = "none";
    document.getElementById("selectedImages").textContent = ""
  }
  
  function showUserCreation() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("vehiclePricesContent").style.display = "none";
    document.getElementById("sparePricesContent").style.display = "none";
    document.getElementById("userCreationContent").style.display = "block";
    document.getElementById("selectedImages").textContent = ""
  }
  
  function randomPass() {
    const password = Math.random().toString(36).slice(-4);
    alert(`Generated Password: ${password}`);
  }
  
  function searchVehicles() {
    const query = document.getElementById("vehicleSearch").value.toLowerCase();
    const vehicleResults = document.getElementById("vehicleResults");
    vehicleResults.innerHTML = "";
  
    if (query === "") {
      return;
    }
  
    const filteredVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.year.includes(query)
    );
    displayVehicles(filteredVehicles);
  }
  
  function searchSpares() {
    const query = document.getElementById("spareSearch").value.toLowerCase();
    const spareResults = document.getElementById("spareResults");
    spareResults.innerHTML = "";
  
    if (query === "") {
      return;
    }
  
    const filteredSpares = spares.filter(
      (spare) =>
        spare.brand.toLowerCase().includes(query) ||
        spare.model.toLowerCase().includes(query) ||
        spare.year.includes(query)
    );
    displaySpares(filteredSpares);
  }
  
  function displayVehicles(filteredVehicles) {
    const vehicleResults = document.getElementById("vehicleResults");
    vehicleResults.innerHTML = "";
  
    filteredVehicles.forEach((vehicle) => {
      const vehicleElement = document.createElement("div");
      vehicleElement.className = "vehicle";
      vehicleElement.innerHTML = `
              <h3 onclick="showPopup(${vehicle.Id}, 'vehicle')">${vehicle.brand} ${vehicle.model} (${vehicle.year})</h3>
              <h4>Type: ${vehicle.type}</h4>
              <h4>Shop: ${vehicle.shop}</h4>
          `;
  
      vehicleResults.appendChild(vehicleElement);
    });
  }
  
  function displaySpares(filteredSpares) {
    const spareResults = document.getElementById("spareResults");
    spareResults.innerHTML = "";
  
    filteredSpares.forEach((spare) => {
      const spareElement = document.createElement("div");
      spareElement.className = "vehicle";
      spareElement.innerHTML = `
              <h3 onclick="showPopup(${spare.Id}, 'spare')">${spare.brand} ${spare.model} (${spare.year})</h3>
              <h4>Type: ${spare.type}</h4>
          `;
      spareResults.appendChild(spareElement);
    });
  }
  
  function populateDropdown(categoryId, parts) {
    const dropdown = document.getElementById(categoryId);
    dropdown.innerHTML = "";
    if (parts && parts.length) {
      parts.forEach((part) => {
        const option = document.createElement("option");
        option.value = part.partNumber;
        option.textContent = part.partName;
        dropdown.appendChild(option);
      });
    } else {
      const option = document.createElement("option");
      option.textContent = "No parts available";
      dropdown.appendChild(option);
    }
  }
  
  function showPopup(itemId, type) {
    if (type === "vehicle") {
      const vehicle = vehicles.find((v) => v.Id === itemId.toString());
      if (vehicle) {
        document.getElementById("popupImage").src = `images/${vehicle.image}`;
        document.getElementById(
          "popupName"
        ).textContent = `${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
        document.getElementById(
          "popupSpecs"
        ).textContent = `Type: ${vehicle.type}`;
        document.getElementById(
          "popupPrice"
        ).textContent = `Price: Ksh: ${getRandomPrice()}`;
        document.getElementById("popupShop").textContent = `Shop: ${
          vehicle.shop || "Not available"
        }`;
  
        document.getElementById("popup").style.display = "flex";
        document.getElementById("popup").style.flexDirection = "column";
      }
    } else if (type === "spare") {
      const spare = spares.find((s) => s.Id === itemId.toString());
  
      if (spare) {
        const vehicleSpares = spares.find(
          (s) =>
            s.brand === spare.brand &&
            s.model === spare.model &&
            s.year === spare.year
        );
  
        if (vehicleSpares) {
          populateDropdown("mechanical", vehicleSpares.categories.mechanical);
          populateDropdown("interior", vehicleSpares.categories.interior);
          populateDropdown(
            "individualBodyParts",
            vehicleSpares.categories.individualBodyParts
          );
          populateDropdown(
            "bodyPartAssemblies",
            vehicleSpares.categories.bodyPartAssemblies
          );
        } else {
          populateDropdown("mechanical", []);
          populateDropdown("interior", []);
          populateDropdown("individualBodyParts", []);
          populateDropdown("bodyPartAssemblies", []);
        }
        const searchbtn = document.getElementById("searchPartsButton");
        searchbtn.addEventListener("click", () => searchParts());
        document.getElementById("sparePopup").style.display = "flex";
        document.getElementById("sparePopup").style.flexDirection = "column";
      }
    }
  }
  
  function closePopup(type) {
    if (type === "vehicle") {
      document.getElementById("popup").style.display = "none";
    } else if (type === "spare") {
      document.getElementById("sparePopup").style.display = "none";
    }
  }
  
  function getRandomPrice() {
    return (Math.random() * (5000000 - 2000000) + 2000000).toFixed(2);
  }
  
  function addToList() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
  
    if (
      nameInput.value.trim() === "" ||
      emailInput.value.trim() === "" ||
      phoneInput.value.trim() === ""
    ) {
      alert("Please fill in all fields");
      return;
    }
  
    if (!emailPattern.test(emailInput.value)) {
      alert("Please enter a valid email address");
      return;
    }
  
    if (!phonePattern.test(phoneInput.value)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
  
    const userList = document.getElementById("userList");
    const userItem = document.createElement("li");
    userItem.textContent = `${nameInput.value} (${emailInput.value}, ${phoneInput.value})`;
    userList.appendChild(userItem);
  
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
  }
  
  
  function searchParts() {
    const selectedParts = [
      document.getElementById("mechanical").value,
      document.getElementById("interior").value,
      document.getElementById("individualBodyParts").value,
      document.getElementById("bodyPartAssemblies").value
    ];
  
    const selectedImagesContainer = document.getElementById("selectedImages");
    selectedImagesContainer.innerHTML = ""; 
  
    selectedParts.forEach(partNumber => {
      const selectedPart = spares
        .flatMap(spare => [
          ...spare.categories.mechanical,
          ...spare.categories.interior,
          ...spare.categories.individualBodyParts,
          ...spare.categories.bodyPartAssemblies
        ])
        .find(part => part.partNumber === partNumber);
  
      if (selectedPart) {
        for (let i = 0; i < 3; i++) { 
          const card = document.createElement("div");
          card.className = "card";
  
          const img = document.createElement("img");
          img.src = `images/${selectedPart.image}`;
          img.alt = selectedPart.partName;
          img.className = "card-img";
  
          const details = document.createElement("div");
          details.className = "card-details";
          details.innerHTML = `
            <h4>${selectedPart.partName}</h4>
            <p>Part Number: ${selectedPart.partNumber}</p>
            <p>Price: ${selectedPart.price}</p>
          `;
  
          card.appendChild(img);
          card.appendChild(details);
          selectedImagesContainer.appendChild(card);
        }
      }
    });
  
    // Hide the spare parts popup
    document.getElementById("sparePopup").style.display = "none";
    document.getElementById("sparePricesContent").style.display = 'none'
  }
  
  
  
  
  
  
  function closePopup(type) {
    if (type === "vehicle") {
      document.getElementById("popup").style.display = "none";
    } else if (type === "spare") {
      document.getElementById("sparePopup").style.display = "none";
    } else if (type === "part") {
      document.getElementById("partPopup").style.display = "none";
    }
  }
  