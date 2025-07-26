// Teachers Page JavaScript

// Global variables
let teachersData = [];
let currentTeacher = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTeachersPage();
    setupEventListeners();
    loadTeachersData();
});

// Initialize the teachers page
function initializeTeachersPage() {
    console.log('Teachers page initialized');
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Modal close functionality
    const modal = document.getElementById('teacherModal');
    const closeBtn = document.querySelector('.close');
    
    // Close modal when clicking the X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTeacherModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeTeacherModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeTeacherModal();
        }
    });
    
    // Setup search functionality if search input exists
    const searchInput = document.getElementById('teacherSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterTeachers, 300));
    }
    
    // Setup filter functionality
    const filterSelect = document.getElementById('subjectFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterTeachers);
    }
}

// Load teachers data from DOM or API
function loadTeachersData() {
    const teacherCards = document.querySelectorAll('.teacher-card');
    teachersData = Array.from(teacherCards).map(card => {
        return {
            id: card.querySelector('.view-profile-btn').getAttribute('onclick').match(/'([^']+)'/)[1],
            name: card.querySelector('.teacher-name').textContent,
            subject: card.querySelector('.teacher-subject').textContent,
            qualification: card.querySelector('.teacher-qualification').textContent,
            experience: card.querySelector('.teacher-experience').textContent,
            image: card.querySelector('.teacher-image').src,
            bio: card.querySelector('.teacher-bio p') ? card.querySelector('.teacher-bio p').textContent : '',
            email: card.querySelector('a[href^="mailto:"]') ? card.querySelector('a[href^="mailto:"]').getAttribute('href').replace('mailto:', '') : '',
            phone: card.querySelector('a[href^="tel:"]') ? card.querySelector('a[href^="tel:"]').getAttribute('href').replace('tel:', '') : ''
        };
    });
}

// Open teacher modal
function openTeacherModal(teacherId) {
    showLoadingSpinner(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const teacher = findTeacherById(teacherId);
        if (teacher) {
            displayTeacherModal(teacher);
        } else {
            showError('Teacher information not found');
        }
        showLoadingSpinner(false);
    }, 500);
}

// Find teacher by ID
function findTeacherById(teacherId) {
    return teachersData.find(teacher => teacher.id === teacherId);
}

// Display teacher in modal
function displayTeacherModal(teacher) {
    const modal = document.getElementById('teacherModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    currentTeacher = teacher;
    
    const modalContent = `
        <div class="modal-teacher-profile">
            <div class="modal-teacher-header">
                <div class="modal-teacher-image">
                    <img src="${teacher.image}" alt="${teacher.name}" />
                </div>
                <div class="modal-teacher-basic-info">
                    <h2>${teacher.name}</h2>
                    <p class="modal-subject">${teacher.subject}</p>
                    <p class="modal-qualification">${teacher.qualification}</p>
                    <p class="modal-experience">${teacher.experience}</p>
                </div>
            </div>
            
            <div class="modal-teacher-details">
                <div class="modal-section">
                    <h3><i class="fas fa-user"></i> About</h3>
                    <p>${teacher.bio || 'No biography available.'}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-graduation-cap"></i> Specialization</h3>
                    <p>${teacher.subject}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-address-book"></i> Contact Information</h3>
                    <div class="contact-info">
                        ${teacher.email ? `
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <a href="mailto:${teacher.email}">${teacher.email}</a>
                            </div>
                        ` : ''}
                        ${teacher.phone ? `
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <a href="tel:${teacher.phone}">${teacher.phone}</a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add modal styles if not already present
    addModalStyles();
}

// Close teacher modal
function closeTeacherModal() {
    const modal = document.getElementById('teacherModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentTeacher = null;
    }
}

// Show/hide loading spinner
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// Show error message
function showError(message) {
    const modal = document.getElementById('teacherModal');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="closeTeacherModal()" class="error-btn">Close</button>
            </div>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Filter teachers based on search and subject
function filterTeachers() {
    const searchTerm = document.getElementById('teacherSearch')?.value.toLowerCase() || '';
    const selectedSubject = document.getElementById('subjectFilter')?.value || '';
    
    const teacherCards = document.querySelectorAll('.teacher-card');
    let visibleCount = 0;
    
    teacherCards.forEach(card => {
        const name = card.querySelector('.teacher-name').textContent.toLowerCase();
        const subject = card.querySelector('.teacher-subject').textContent.toLowerCase();
        const qualification = card.querySelector('.teacher-qualification').textContent.toLowerCase();
        
        const matchesSearch = !searchTerm || 
            name.includes(searchTerm) || 
            subject.includes(searchTerm) ||
            qualification.includes(searchTerm);
            
        const matchesSubject = !selectedSubject || subject.includes(selectedSubject.toLowerCase());
        
        if (matchesSearch && matchesSubject) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    updateNoResultsMessage(visibleCount);
}

// Update no results message
function updateNoResultsMessage(visibleCount) {
    let noResults = document.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No Teachers Found</h3>
                <p>Try adjusting your search criteria.</p>
            `;
            document.querySelector('.teachers-grid').appendChild(noResults);
        }
        noResults.style.display = 'block';
    } else if (noResults) {
        noResults.style.display = 'none';
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add dynamic modal styles
function addModalStyles() {
    if (document.getElementById('modal-dynamic-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-dynamic-styles';
    style.textContent = `
        .modal-teacher-profile {
            padding: 20px;
        }
        
        .modal-teacher-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .modal-teacher-image img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #667eea;
        }
        
        .modal-teacher-basic-info h2 {
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 1.8rem;
        }
        
        .modal-subject {
            color: #667eea;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .modal-qualification, .modal-experience {
            color: #666;
            margin-bottom: 3px;
        }
        
        .modal-section {
            margin-bottom: 25px;
        }
        
        .modal-section h3 {
            color: #2c3e50;
            margin-bottom: 12px;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .modal-section h3 i {
            color: #667eea;
        }
        
        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .contact-item i {
            color: #667eea;
            width: 20px;
        }
        
        .contact-item a {
            color: #2c3e50;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .contact-item a:hover {
            color: #667eea;
        }
        
        .error-message {
            text-align: center;
            padding: 40px 20px;
        }
        
        .error-message i {
            font-size: 3rem;
            color: #e74c3c;
            margin-bottom: 20px;
        }
        
        .error-message h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .error-btn {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 20px;
            cursor: pointer;
            margin-top: 20px;
            transition: transform 0.3s ease;
        }
        
        .error-btn:hover {
            transform: translateY(-2px);
        }
        
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        
        .no-results i {
            font-size: 4rem;
            color: #ddd;
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .modal-teacher-header {
                flex-direction: column;
                text-align: center;
                gap: 15px;
            }
            
            .modal-teacher-image img {
                width: 100px;
                height: 100px;
            }
            
            .modal-teacher-basic-info h2 {
                font-size: 1.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.onclick = scrollToTop;
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addScrollToTopButton, 1000);
});

// Animation utilities
function animateOnScroll() {
    const cards = document.querySelectorAll('.teacher-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Load more teachers functionality (if needed for pagination)
function loadMoreTeachers() {
    // This function can be implemented if you need pagination
    showLoadingSpinner(true);
    
    // Simulate API call
    setTimeout(() => {
        console.log('Loading more teachers...');
        showLoadingSpinner(false);
    }, 1000);
}

// Export functions for global access
window.openTeacherModal = openTeacherModal;
window.closeTeacherModal = closeTeacherModal;
window.loadMoreTeachers = loadMoreTeachers;
window.scrollToTop = scrollToTop;