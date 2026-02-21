// Main JavaScript for Hephzibah Vics Montessori Website

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
let mobileMenuBtn;
let mainMenu;
let currentPage = 'home';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website initialized');

    // Initialize mobile menu
    initMobileMenu();

    // Set active menu item based on current page
    setActiveMenu();

    // Initialize page-specific functions
    initPage();

    // Test backend connection
    testBackendConnection();
});

// Initialize mobile menu functionality
function initMobileMenu() {
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mainMenu = document.getElementById('main-menu');

    if (mobileMenuBtn && mainMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mainMenu.classList.toggle('show');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mainMenu.classList.remove('show');
            }
        });
    }
}

// Set active menu item based on current page
function setActiveMenu() {
    const menuItems = document.querySelectorAll('.main-menu a');
    const currentPath = window.location.pathname;

    menuItems.forEach(item => {
        item.classList.remove('active');

        const href = item.getAttribute('href');
        if (href === 'index.html' || href === '/') {
            if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
                item.classList.add('active');
            }
        } else if (currentPath.includes(href)) {
            item.classList.add('active');
        }
    });
}

// Initialize page-specific functions
function initPage() {
    const page = getCurrentPage();

    switch(page) {
        case 'home':
            initHomePage();
            break;
        case 'gallery':
            initGalleryPage();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'portal':
            initPortalPage();
            break;
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];

    if (page === '' || page === 'index') return 'home';
    return page;
}

// ===== HOME PAGE FUNCTIONS =====
function initHomePage() {
    console.log('Initializing home page');
    loadDashboardData();

    // Set up auto-refresh
    setInterval(loadDashboardData, 120000);
}

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        updateDashboard(data);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        useStaticData();
    }
}

function updateDashboard(data) {
    // Update header news
    updateHeaderNews(data.header_news || []);

    // Update latest news
    updateLatestNews(data.latest_news || []);

    // Update upcoming events
    updateUpcomingEvents(data.upcoming_events || []);

    // Update notice board
    updateNoticeBoard(data.notice_board || []);
}

function updateHeaderNews(news) {
    const element = document.getElementById('header-news');
    if (element && news.length > 0) {
        element.innerHTML = news.join(' 🚀 ');
    }
}

function updateLatestNews(news) {
    const element = document.getElementById('latest-news');
    if (element) {
        if (news.length > 0) {
            element.innerHTML = news.map(item => `<li>${item}</li>`).join('');
        } else {
            element.innerHTML = '<li>No news available at the moment.</li>';
        }
    }
}

function updateUpcomingEvents(events) {
    const element = document.getElementById('upcoming-events');
    if (element) {
        if (events.length > 0) {
            element.innerHTML = events.map(event => `
                <li>
                    <span class="event-date">
                        <span>${event.date.split(' ')[0]}</span>
                        <span>${event.date.split(' ')[1]}</span>
                    </span>
                    <span>${event.title}${event.description ? '<br><small>' + event.description + '</small>' : ''}</span>
                </li>
            `).join('');
        } else {
            element.innerHTML = '<li><span class="event-date">--<br>--</span><span>No upcoming events</span></li>';
        }
    }
}

function updateNoticeBoard(notices) {
    const element = document.getElementById('notice-board');
    if (element) {
        if (notices.length > 0) {
            element.innerHTML = notices.map(notice => `<li>${notice}</li>`).join('');
        } else {
            element.innerHTML = '<li>No notices at the moment.</li>';
        }
    }
}

function useStaticData() {
    updateHeaderNews(['Christmas party date 12th December 2025', 'School resumes 15th January 2026']);

    updateLatestNews([
        '12th dec 2025 Christmas Party',
        '16th dec 2025 Collection of result',
        '24th dec 2025 Christmas eve',
        '25th dec 2025 Christmas day',
        '26th dec 2025 Boxing day',
        '31st dec 2025 New years eve',
        '1st Jan 2026 New year',
        '15th Jan 2026 Resumption into the second term'
    ]);

    updateUpcomingEvents([
        { date: '12 Dec', title: 'Christmas Party', description: '' },
        { date: '16 Dec', title: 'Collection of result', description: 'time 10am to 1pm' },
        { date: '24 Dec', title: 'Christmas eve', description: '' },
        { date: '25 Dec', title: 'Christmas', description: '' }
    ]);

    updateNoticeBoard([
        'School gate open 7am',
        'School gate close 8am',
        'Nursery closing time 1pm',
        'Lower Primary closing time 2pm',
        'Upper Primary closing time 2:30pm',
        'Secondary school closing time 3pm'
    ]);
}

// ===== GALLERY PAGE FUNCTIONS =====
function initGalleryPage() {
    console.log('Initializing gallery page');
    loadGalleryImages();

    // Initialize lightbox if needed
    initLightbox();
}

async function loadGalleryImages() {
    try {
        // In a real implementation, this would fetch from API
        const images = [
            { src: 'images/gallery1.jpg', title: 'School Building', category: 'campus' },
            { src: 'images/gallery2.jpg', title: 'Classroom Activities', category: 'academics' },
            { src: 'images/gallery3.jpg', title: 'Sports Day', category: 'sports' },
            { src: 'images/gallery4.jpg', title: 'Annual Function', category: 'events' },
            { src: 'images/gallery5.jpg', title: 'Science Lab', category: 'facilities' },
            { src: 'images/gallery6.jpg', title: 'Library', category: 'facilities' }
        ];

        displayGalleryImages(images);

    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
}

function displayGalleryImages(images) {
    const gallery = document.getElementById('gallery-grid');
    if (!gallery) return;

    gallery.innerHTML = images.map(image => `
        <div class="gallery-item" data-category="${image.category}">
            <img src="${image.src}" alt="${image.title}"
                 onerror="this.src='https://via.placeholder.com/400x300/3498db/ffffff?text=${encodeURIComponent(image.title)}'">
            <div class="gallery-overlay">
                <h4>${image.title}</h4>
            </div>
        </div>
    `).join('');
}

function initLightbox() {
    // Simple lightbox implementation
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;

            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img src="${imgSrc}" alt="${imgAlt}">
                    <p>${imgAlt}</p>
                </div>
            `;

            document.body.appendChild(lightbox);

            // Add styles
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            `;

            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                position: relative;
            `;

            content.querySelector('img').style.cssText = `
                max-width: 100%;
                max-height: 70vh;
                border-radius: 8px;
            `;

            content.querySelector('p').style.cssText = `
                color: white;
                text-align: center;
                margin-top: 10px;
                font-size: 18px;
            `;

            const closeBtn = lightbox.querySelector('.close-lightbox');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: -40px;
                color: white;
                font-size: 30px;
                cursor: pointer;
                background: rgba(0,0,0,0.5);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            closeBtn.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            });
        });
    });
}

// ===== CONTACT PAGE FUNCTIONS =====
function initContactPage() {
    console.log('Initializing contact page');

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
    }

    // In a real implementation, you would send this to your backend
    console.log('Contact form submitted:', data);

    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
}

// ===== STUDENT PORTAL FUNCTIONS =====
function initPortalPage() {
    console.log('Initializing student portal page');

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.username || !data.password) {
        alert('Please enter both username and password.');
        return;
    }

    // In a real implementation, you would authenticate with backend
    console.log('Login attempt:', data);

    // For demo purposes
    if (data.username === 'student' && data.password === 'password') {
        alert('Login successful! Redirecting to dashboard...');
        // Redirect to dashboard or show dashboard content
        showStudentDashboard();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function showStudentDashboard() {
    const portalContent = document.getElementById('portal-content');
    if (portalContent) {
        portalContent.innerHTML = `
            <div class="student-dashboard">
                <h2>Welcome to Student Portal</h2>
                <div class="dashboard-cards">
                    <div class="card">
                        <h3>📚 My Courses</h3>
                        <p>View your current courses and progress.</p>
                        <button class="btn btn-primary">View Courses</button>
                    </div>
                    <div class="card">
                        <h3>📊 Grades & Results</h3>
                        <p>Check your grades and examination results.</p>
                        <button class="btn btn-primary">View Results</button>
                    </div>
                    <div class="card">
                        <h3>📅 Schedule</h3>
                        <p>View your class schedule and timetable.</p>
                        <button class="btn btn-primary">View Schedule</button>
                    </div>
                    <div class="card">
                        <h3>💳 Fee Payment</h3>
                        <p>Pay fees and view payment history.</p>
                        <button class="btn btn-primary">Pay Fees</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// ===== BACKEND CONNECTION =====
async function testBackendConnection() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            console.log('✅ Backend connected successfully');
            document.getElementById('api-status').textContent = '✅ Backend Connected';
            document.getElementById('api-status').style.color = '#2ecc71';
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Backend connection failed:', error);
        document.getElementById('api-status').textContent = '⚠️ Backend Not Connected';
        document.getElementById('api-status').style.color = '#e74c3c';
        return false;
    }
}

// Utility function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Export functions for use in HTML
window.refreshData = loadDashboardData;
window.addNews = async function() {
    const title = prompt('Enter news title:');
    if (title) {
        try {
            await apiRequest('/api/news', 'POST', {
                title: title,
                content: 'News content here...'
            });
            alert('News added successfully!');
            loadDashboardData();
        } catch (error) {
            alert('Failed to add news.');
        }
    }
};