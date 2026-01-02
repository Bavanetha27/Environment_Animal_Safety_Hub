// Pet Adoption Page JavaScript

class AdoptionPage {
  constructor() {
    this.pets = [];
    this.filteredPets = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.loadPetsData();
    this.setupEventListeners();
    this.renderPets();
    this.initializeAnimations();
  }

  async loadPetsData() {
    try {
      const response = await fetch('../../assets/data/adoption-data.json');
      this.pets = await response.json();
      this.filteredPets = [...this.pets];
    } catch (error) {
      console.error('Error loading pets data:', error);
      // Fallback data if JSON fails to load
      this.pets = this.getFallbackPets();
      this.filteredPets = [...this.pets];
    }
  }

  getFallbackPets() {
    return [
      {
        id: 1,
        name: "Buddy",
        breed: "Golden Retriever",
        age: "2 years",
        gender: "Male",
        size: "Large",
        color: "Golden",
        description: "Friendly and energetic golden retriever who loves playing fetch and cuddling.",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
        vaccinated: true,
        neutered: true,
        location: "Delhi Shelter"
      }
    ];
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.setActiveFilter(e.target);
        this.filterPets(e.target.dataset.filter);
      });
    });

    // Adoption form
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
      adoptionForm.addEventListener('submit', (e) => this.handleAdoptionSubmit(e));
    }

    // Modal close
    const modal = document.getElementById('petModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });

      const closeBtn = modal.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }
  }

  setActiveFilter(button) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  }

  filterPets(filter) {
    this.currentFilter = filter;

    if (filter === 'all') {
      this.filteredPets = [...this.pets];
    } else if (filter === 'dogs') {
      this.filteredPets = this.pets.filter(pet => !pet.breed.toLowerCase().includes('cat'));
    } else if (filter === 'cats') {
      this.filteredPets = this.pets.filter(pet => pet.breed.toLowerCase().includes('cat'));
    } else if (filter === 'small') {
      this.filteredPets = this.pets.filter(pet => pet.size === 'Small');
    } else if (filter === 'medium') {
      this.filteredPets = this.pets.filter(pet => pet.size === 'Medium');
    } else if (filter === 'large') {
      this.filteredPets = this.pets.filter(pet => pet.size === 'Large');
    }

    this.renderPets();
  }

  renderPets() {
    const petsGrid = document.getElementById('petsGrid');
    if (!petsGrid) return;

    petsGrid.innerHTML = '';

    this.filteredPets.forEach(pet => {
      const petCard = this.createPetCard(pet);
      petsGrid.appendChild(petCard);
    });
  }

  createPetCard(pet) {
    const card = document.createElement('div');
    card.className = 'pet-card';
    card.innerHTML = `
      <div class="pet-image">
        <img src="${pet.image}" alt="${pet.name}" loading="lazy">
        <div class="pet-status">Available</div>
      </div>
      <div class="pet-info">
        <h3 class="pet-name">${pet.name}</h3>
        <div class="pet-details">
          <span class="pet-detail">${pet.breed}</span>
          <span class="pet-detail">${pet.age}</span>
          <span class="pet-detail">${pet.gender}</span>
          <span class="pet-detail">${pet.size}</span>
        </div>
        <p class="pet-description">${pet.description}</p>
        <div class="pet-actions">
          <button class="btn-details" onclick="adoptionPage.showPetDetails(${pet.id})">
            View Details
          </button>
          <button class="btn-adopt" onclick="adoptionPage.showAdoptionForm(${pet.id})">
            Adopt Me
          </button>
        </div>
      </div>
    `;
    return card;
  }

  showPetDetails(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return;

    const modal = document.getElementById('petModal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
      <div class="pet-detail-info">
        <div style="text-align: center; margin-bottom: 2rem;">
          <img src="${pet.image}" alt="${pet.name}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px;">
          <h3 style="margin-top: 1rem; color: #2d3748;">${pet.name}</h3>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Breed:</span>
          <span class="pet-detail-value">${pet.breed}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Age:</span>
          <span class="pet-detail-value">${pet.age}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Gender:</span>
          <span class="pet-detail-value">${pet.gender}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Size:</span>
          <span class="pet-detail-value">${pet.size}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Color:</span>
          <span class="pet-detail-value">${pet.color}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Vaccinated:</span>
          <span class="pet-detail-value">${pet.vaccinated ? 'Yes' : 'No'}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Neutered:</span>
          <span class="pet-detail-value">${pet.neutered ? 'Yes' : 'No'}</span>
        </div>
        <div class="pet-detail-row">
          <span class="pet-detail-label">Location:</span>
          <span class="pet-detail-value">${pet.location}</span>
        </div>
        <div style="margin-top: 1rem;">
          <strong>Description:</strong>
          <p style="margin-top: 0.5rem; color: #718096; line-height: 1.6;">${pet.description}</p>
        </div>
      </div>
    `;

    modal.classList.add('show');
  }

  showAdoptionForm(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return;

    // Scroll to form section
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });

      // Pre-fill pet name in form
      const petSelect = document.getElementById('petSelect');
      if (petSelect) {
        petSelect.value = pet.id.toString();
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('petModal');
    modal.classList.remove('show');
  }

  async handleAdoptionSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!this.validateForm(data)) {
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await this.submitAdoptionApplication(data);

      // Show success message
      this.showSuccessMessage('Adoption application submitted successfully! We will contact you within 24 hours.');

      // Reset form
      e.target.reset();

    } catch (error) {
      console.error('Error submitting application:', error);
      this.showErrorMessage('Failed to submit application. Please try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  validateForm(data) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'petSelect', 'experience', 'homeType'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const field of required) {
      if (!data[field] || data[field].trim() === '') {
        this.showErrorMessage(`Please fill in all required fields.`);
        return false;
      }
    }

    if (!emailRegex.test(data.email)) {
      this.showErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (data.phone.length < 10) {
      this.showErrorMessage('Please enter a valid phone number.');
      return false;
    }

    return true;
  }

  async submitAdoptionApplication(data) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Adoption application submitted:', data);
        resolve();
      }, 2000);
    });
  }

  async handleNewsletterSubmit(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;

    if (!email) {
      this.showErrorMessage('Please enter your email address.');
      return;
    }

    try {
      // Simulate newsletter signup
      await this.submitNewsletterSignup(email);
      this.showSuccessMessage('Thank you for subscribing! You will receive updates about our pets and events.');
      e.target.reset();
    } catch (error) {
      this.showErrorMessage('Failed to subscribe. Please try again.');
    }
  }

  async submitNewsletterSignup(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Newsletter signup:', email);
        resolve();
      }, 1000);
    });
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-notification');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message-notification ${type}`;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#48bb78' : '#f56565'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      max-width: 400px;
      font-weight: 500;
    `;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  initializeAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }

    // Animate stats counter
    this.animateStats();
  }

  animateStats() {
    const statNumbers = document.querySelectorAll('.adoption-stat .stat-number');

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current).toLocaleString();
        }
      }, 30);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adoptionPage = new AdoptionPage();
});
