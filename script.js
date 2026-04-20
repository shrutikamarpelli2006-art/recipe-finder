// Rasoi Bharat - The Soul of Indian Cuisine
// Data is loaded from data.js into variable 'indianFoodData'

// Constants & State
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let filteredData = [...indianFoodData];
let currentFilters = {
    course: 'all',
    diet: 'all',
    region: 'all',
    search: ''
};

// DOM Elements
const recipesGrid = document.getElementById('recipes-grid');
const resultsCount = document.getElementById('results-count');
const loadMoreBtn = document.getElementById('load-more');
const mainSearch = document.getElementById('main-search');
const modal = document.getElementById('recipe-modal');
const closeModal = document.getElementById('close-modal');

// Initialize
function init() {
    renderGrid();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    mainSearch.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        applyFilters();
    });

    // Filters
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const group = chip.dataset.filter;
            const value = chip.dataset.value;

            // UI update: de-active others in same group
            chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // State update
            currentFilters[group] = value;
            applyFilters();
        });
    });

    // Load More
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderGrid(true);
    });

    // Modal
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    window.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
}

// Apply All Filters
function applyFilters() {
    currentPage = 1;
    filteredData = indianFoodData.filter(item => {
        const matchesCourse = currentFilters.course === 'all' || item.course.toLowerCase() === currentFilters.course;
        const matchesDiet = currentFilters.diet === 'all' || item.diet.toLowerCase() === currentFilters.diet;
        const matchesRegion = currentFilters.region === 'all' || item.region === currentFilters.region;
        const matchesSearch = item.name.toLowerCase().includes(currentFilters.search) || 
                             item.ingredients.toLowerCase().includes(currentFilters.search);
        
        return matchesCourse && matchesDiet && matchesRegion && matchesSearch;
    });

    renderGrid();
}

// Render Grid
function renderGrid(append = false) {
    if (!append) recipesGrid.innerHTML = '';
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const itemsToShow = filteredData.slice(start, end);

    resultsCount.textContent = `Showing ${filteredData.length} dishes`;

    if (filteredData.length === 0) {
        recipesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 5rem; color: #a0a0a5;">
                <h3 style="font-size: 2rem;">No flavors found matching your search</h3>
                <p>Try exploring different regions or courses.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    itemsToShow.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card animate-in';
        card.setAttribute('data-course', item.course.toLowerCase());
        card.style.animationDelay = `${(index % ITEMS_PER_PAGE) * 0.1}s`;

        const totalTime = (item.prep_time > 0 ? item.prep_time : 0) + (item.cook_time > 0 ? item.cook_time : 30);
        const isVeg = item.diet === 'vegetarian';
        const courseEmoji = { 'dessert': '🍮', 'main course': '🍛', 'snack': '🥙', 'starter': '🫕' };
        const emoji = courseEmoji[item.course.toLowerCase()] || '🍽️';

        card.innerHTML = `
            <div class="card-accent-bar"></div>
            <div class="card-content">
                <div class="card-header-row">
                    <span class="card-emoji">${emoji}</span>
                    <span class="card-tag ${isVeg ? 'veg' : 'non-veg'}">${isVeg ? '🌿 Veg' : '🍖 Non-Veg'}</span>
                </div>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-flavor">${item.flavor_profile !== '-1' ? item.flavor_profile + ' flavors' : 'Traditional dish'}</p>
                <div class="card-meta">
                    <span>📍 ${item.state !== '-1' ? item.state : item.region}</span>
                    <span>🕒 ${totalTime}m</span>
                </div>
            </div>
        `;

        card.onclick = () => openModal(item);
        recipesGrid.appendChild(card);
    });

    loadMoreBtn.style.display = end < filteredData.length ? 'block' : 'none';
}

// Category images used for filter buttons only
const CATEGORY_IMAGES = {
    'dessert': 'assets/indian_desserts_1776618260109.png',
    'main course': 'assets/indian_food_hero_1776618094107.png',
    'snack': 'assets/paneer_sandwich.png',
    'starter': 'assets/tomato_rice.png',
};








// Modal Logic
function openModal(item) {
    const modalHero = document.querySelector('.modal-hero');
    modalHero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.8)), url('${getDishImage(item)}')`;
    
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-prep').textContent = item.prep_time > 0 ? item.prep_time + ' min' : '15 min';
    document.getElementById('modal-cook').textContent = item.cook_time > 0 ? item.cook_time + ' min' : '25 min';
    document.getElementById('modal-flavor').textContent = item.flavor_profile !== "-1" ? item.flavor_profile : 'Savory';
    document.getElementById('modal-state').textContent = item.state !== "-1" ? item.state : item.region;
    
    document.getElementById('modal-ingredients').textContent = item.ingredients;
    
    const badges = document.getElementById('modal-badges');
    badges.innerHTML = `
        <span class="modal-badge">${item.diet}</span>
        <span class="modal-badge">${item.course}</span>
        <span class="modal-badge">${item.region}</span>
    `;
    
    modal.classList.add('active');
}

// Start
init();

