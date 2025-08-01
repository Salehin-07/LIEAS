// Notice Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeNoticeEvents();
    animateNoticeCards();
    handleScroll();
    initializeDeleteButtons();
    initializePaginationSmoothing();
});

// Initialize event listeners
function initializeNoticeEvents() {
    // Add click listeners to all notice cards for better UX
    const noticeCards = document.querySelectorAll('.notice-card');
    noticeCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Toggle notice details expansion
function toggleNoticeDetails(noticeId) {
    const expandedContent = document.getElementById(`notice-expanded-${noticeId}`);
    const readMoreBtn = event.target.closest('.btn-read-more');
    const icon = readMoreBtn.querySelector('.icon-expand');
    
    if (!expandedContent) return;
    
    const isExpanded = expandedContent.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse
        expandedContent.classList.remove('expanded');
        readMoreBtn.innerHTML = '<i class="icon-expand"></i>Read More';
        readMoreBtn.setAttribute('aria-expanded', 'false');
        
        // Smooth scroll to card top
        setTimeout(() => {
            const card = readMoreBtn.closest('.notice-card');
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    } else {
        // Expand
        expandedContent.classList.add('expanded');
        readMoreBtn.innerHTML = '<i class="icon-collapse"></i>Read Less';
        readMoreBtn.setAttribute('aria-expanded', 'true');
        
        // Add collapse icon style
        const collapseIcon = readMoreBtn.querySelector('.icon-collapse');
        if (collapseIcon) {
            collapseIcon.style.transform = 'rotate(180deg)';
        }
    }
    
    // Add loading effect
    showLoadingEffect(readMoreBtn);
}

// Show loading effect on buttons
function showLoadingEffect(button) {
    const originalText = button.innerHTML;
    button.style.opacity = '0.7';
    button.style.pointerEvents = 'none';
    
    setTimeout(() => {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    }, 300);
}

// Handle card hover effects
function handleCardHover(e) {
    const card = e.currentTarget;
    card.style.zIndex = '10';
    
    // Add ripple effect
    createRippleEffect(e, card);
}

function handleCardLeave(e) {
    const card = e.currentTarget;
    setTimeout(() => {
        card.style.zIndex = '1';
    }, 300);
}

// Create ripple effect on card interaction
function createRippleEffect(e, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Animate notice cards on page load
function animateNoticeCards() {
    const cards = document.querySelectorAll('.notice-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
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

// Handle scroll effects
function handleScroll() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.notice-header');
        
        if (header) {
            const parallaxSpeed = 0.5;
            header.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            header.style.opacity = Math.max(0.3, 1 - scrolled / 300);
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Keyboard navigation support
function handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
        // Close all expanded notices
        const expandedNotices = document.querySelectorAll('.notice-expanded.expanded');
        expandedNotices.forEach(notice => {
            const noticeId = notice.id.replace('notice-expanded-', '');
            const readMoreBtn = notice.parentElement.querySelector('.btn-read-more');
            if (readMoreBtn) {
                readMoreBtn.click();
            }
        });
    }
}

// Initialize delete buttons
function initializeDeleteButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete')) {
            e.preventDefault();
            showDeleteConfirmation(e.target.closest('form'));
        }
    });
}

// Show delete confirmation dialog
function showDeleteConfirmation(form) {
    const dialog = document.querySelector('.confirm-dialog');
    const overlay = document.querySelector('.confirm-dialog-overlay');
    
    dialog.innerHTML = `
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this notice? This action cannot be undone.</p>
        <div class="confirm-dialog-buttons">
            <button class="btn-confirm-delete">Delete</button>
            <button class="btn-cancel-delete">Cancel</button>
        </div>
    `;
    
    overlay.classList.add('active');
    dialog.classList.add('active');
    
    dialog.querySelector('.btn-confirm-delete').addEventListener('click', () => {
        showLoadingOverlay();
        form.submit();
    });
    
    dialog.querySelector('.btn-cancel-delete').addEventListener('click', () => {
        overlay.classList.remove('active');
        dialog.classList.remove('active');
    });
    
    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        dialog.classList.remove('active');
    });
}

// Initialize pagination smoothing
function initializePaginationSmoothing() {
    const paginationLinks = document.querySelectorAll('.page-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            showLoadingOverlay();
        });
    });
}

// Show/hide loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// PDF download tracking and animation
function trackPDFDownload(pdfUrl, noticeTitle) {
    const downloadBtns = document.querySelectorAll('.btn-download');
    downloadBtns.forEach(btn => {
        if (btn.href === pdfUrl) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
    });
}

// Add click listeners for PDF downloads
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-download')) {
        const btn = e.target.closest('.btn-download');
        const card = btn.closest('.notice-card');
        const title = card.querySelector('.notice-title').textContent;
        trackPDFDownload(btn.href, title);
    }
});

// Hide loading overlay when page is fully loaded
window.addEventListener('load', hideLoadingOverlay);