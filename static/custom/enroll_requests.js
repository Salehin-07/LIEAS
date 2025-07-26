// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeEnrollmentPage();
});

// Initialize all functionality
function initializeEnrollmentPage() {
    setupSearch();
    setupFilters();
    setupCardAnimations();
    displayStats();
    setupProcessButtons();
}

// Mark enrollment as processed
function markAsProcessed(enrollmentId, buttonElement) {
    if (buttonElement.classList.contains('enroll-processing')) return;

    buttonElement.classList.add('enroll-processing');
    buttonElement.innerHTML = `
        <svg class="enroll-btn-icon enroll-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m16 12-4-4-4 4"></path>
        </svg>
        Processing...
    `;

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value ||
                      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    fetch(`/enrollment/update-status/${enrollmentId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ status: false, action: 'mark_processed' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const card = buttonElement.closest('.enroll-card');
            card.classList.add('enroll-processed');

            const statusBadge = card.querySelector('.enroll-status-badge');
            statusBadge.textContent = 'Processed';
            statusBadge.classList.remove('enroll-status-active');
            statusBadge.style.background = '#f8d7da';
            statusBadge.style.color = '#721c24';

            buttonElement.innerHTML = `
                <svg class="enroll-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
                Processed
            `;
            buttonElement.disabled = true;

            setTimeout(() => {
                card.style.transition = 'opacity 1s ease, transform 1s ease';
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                    updateStats();
                }, 2000);
            }, 1000);

            showNotification('Enrollment marked as processed successfully!', 'success');
        } else {
            throw new Error(data.message || 'Failed to update status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        buttonElement.classList.remove('enroll-processing');
        buttonElement.innerHTML = `
            <svg class="enroll-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Mark as Processed
        `;
        showNotification('Failed to update status. Please try again.', 'error');
    });
}

// Setup process buttons
function setupProcessButtons() {
    const style = document.createElement('style');
    style.textContent = `
        .enroll-spin {
            animation: enroll-spin 1s linear infinite;
        }
        @keyframes enroll-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Show notification
function showNotification(message, type = 'success') {
    document.querySelectorAll('.enroll-notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `enroll-notification enroll-notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('enroll-notification-show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('enroll-notification-show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update statistics
function updateStats() {
    const visibleCards = document.querySelectorAll('.enroll-card:not([style*="display: none"])');
    const processedCards = document.querySelectorAll('.enroll-card.enroll-processed');

    console.log(`Active enrollments: ${visibleCards.length - processedCards.length}`);
    console.log(`Processed enrollments: ${processedCards.length}`);
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('enrollSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterCards(searchTerm);
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            e.target.value = '';
            filterCards('');
        }
    });
}

// Filter cards
function filterCards(searchTerm, classFilter = 'all') {
    const cards = document.querySelectorAll('.enroll-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const student = card.getAttribute('data-student') || '';
        const father = card.getAttribute('data-father') || '';
        const cardClass = card.getAttribute('data-class') || '';

        const matchesSearch = !searchTerm || student.includes(searchTerm) || father.includes(searchTerm) || cardClass.includes(searchTerm);
        const matchesClass = classFilter === 'all' || cardClass === classFilter;

        if (matchesSearch && matchesClass) {
            card.classList.remove('enroll-hidden');
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.classList.add('enroll-hidden');
            card.style.display = 'none';
        }
    });

    toggleEmptyState(visibleCount === 0);
}

// Filter buttons
function setupFilters() {
    const buttons = document.querySelectorAll('.enroll-filter-btn');
    const searchInput = document.getElementById('enrollSearchInput');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('enroll-filter-active'));
            this.classList.add('enroll-filter-active');

            const filterValue = this.getAttribute('data-filter');
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            filterCards(searchTerm, filterValue);
        });
    });
}

// Card animations
function setupCardAnimations() {
    const cards = document.querySelectorAll('.enroll-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 100);
        });
    });
}

// Empty state toggle
function toggleEmptyState(show) {
    let emptyState = document.querySelector('.enroll-empty-state');

    if (show && !emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'enroll-empty-state';
        emptyState.innerHTML = `
            <h3>No Matching Enrollment Requests</h3>
            <p>Try adjusting your search or filter criteria.</p>
        `;
        document.getElementById('enrollmentGrid').appendChild(emptyState);
    } else if (!show && emptyState) {
        emptyState.style.display = 'none';
    } else if (show && emptyState) {
        emptyState.style.display = 'block';
    }
}

// Display stats
function displayStats() {
    const cards = document.querySelectorAll('.enroll-card');
    const totalCount = cards.length;
    if (totalCount > 0) {
        console.log(`Total Active Enrollments: ${totalCount}`);
        const classCounts = {};
        cards.forEach(card => {
            const c = card.getAttribute('data-class');
            classCounts[c] = (classCounts[c] || 0) + 1;
        });
        console.log('Enrollments by Class:', classCounts);
    }
}

// Optional CSV export
function exportToCSV() {
    const cards = document.querySelectorAll('.enroll-card:not(.enroll-hidden)');
    const headers = ['Student Name'];
    const rows = [headers.join(',')];

    cards.forEach(card => {
        const name = card.querySelector('.enroll-student-name')?.textContent || '';
        rows.push([name].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'enrollment-requests.csv');
    a.click();
    URL.revokeObjectURL(url);
}

// Utility: Format phone
function formatPhoneNumber(phone) {
    return phone.length === 11 ? phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3') : phone;
}

// Utility: Calculate age
function calculateAge(birthDate) {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || 
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const input = document.getElementById('enrollSearchInput');
        if (input) {
            input.focus();
            input.select();
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (typeof exportToCSV === 'function') {
            exportToCSV();
        }
    }
});

// Smooth scroll utility
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}