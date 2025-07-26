// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    initTabNavigation();
    
    // Counter animation for statistics
    initCounterAnimation();
    
    // Smooth scrolling for internal links
    initSmoothScrolling();
    
    // Hero image effects
    initHeroEffects();
    
    // Timeline animations
    initTimelineAnimations();
    
    // Parallax scrolling effect
    initParallaxEffect();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize with hash support
    initializeWithHash();
    
    // Focus management for accessibility
    manageFocus();
    
    // Image error handling
    handleImageErrors();

    // Touch support
    initTouchSupport();

    // Resize handling
    handleResize();
});

// Initialize tab navigation
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    history.replaceState(null, null, `#${tabId}`);
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    
    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.add('active');
        
        activeContent.style.opacity = '0';
        setTimeout(() => {
            activeContent.style.opacity = '1';
            triggerTabAnimations(activeContent);
        }, 50);
    }
}

function triggerTabAnimations(tabContent) {
    const animatedElements = tabContent.querySelectorAll('.point, .value-card, .achievement-item, .timeline-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    if (tabContent.id === 'achievements') {
        const statNumbers = tabContent.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            stat.textContent = '0';
            setTimeout(() => animateCounter(stat), 500);
        });
    }
}

function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Enhanced smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offset = 0; // change this if you have a fixed header
                smoothScrollTo(target.offsetTop - offset, 800);
            }
        });
    });
}

function smoothScrollTo(targetY, duration = 600) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startY, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

function initHeroEffects() {
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        heroImg.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        heroImg.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1) contrast(1)';
        });
        
        heroImg.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        heroImg.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,...'; // simplified
            this.alt = 'Image not available';
        });
    }
}

function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                const delay = Array.from(timelineItems).indexOf(entry.target) * 200;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', optimizedScrollHandler);
    }
}

function initScrollAnimations() {
    const cards = document.querySelectorAll('.point, .value-card, .achievement-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const optimizedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection && scrolled <= heroSection.offsetHeight) {
        const rate = scrolled * -0.3;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
    
    updateActiveNavigation();
}, 10);

function updateActiveNavigation() {
    const sections = document.querySelectorAll('.tab-content');
    const navButtons = document.querySelectorAll('.tab-btn');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-tab') === current) {
            button.classList.add('active');
        }
    });
}

function initializeWithHash() {
    const hash = window.location.hash.substring(1);
    const validTabs = ['mission', 'history', 'values', 'achievements'];
    
    if (hash && validTabs.includes(hash)) {
        switchTab(hash);
    } else {
        switchTab('mission');
    }
}

document.addEventListener('keydown', function(e) {
    const activeTab = document.querySelector('.tab-btn.active');
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    const currentIndex = tabButtons.indexOf(activeTab);
    
    if (e.key === 'ArrowRight' && currentIndex < tabButtons.length - 1) {
        e.preventDefault();
        const nextTab = tabButtons[currentIndex + 1];
        switchTab(nextTab.getAttribute('data-tab'));
        nextTab.focus();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        const prevTab = tabButtons[currentIndex - 1];
        switchTab(prevTab.getAttribute('data-tab'));
        prevTab.focus();
    }
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchTab(hash);
    }
});

function manageFocus() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <div style="
                    width: 100%;
                    height: 200px;
                    background: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    color: #999;
                    font-size: 14px;
                ">
                    Image not available
                </div>
            `;
            this.parentNode.insertBefore(placeholder, this);
        });
    });
}

function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .loading-spinner {
            text-align: center;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function initTouchSupport() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(102, 126, 234, 0.2)';
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.background = '';
            this.click();
        });
    });
}

function handleResize() {
    const heroSection = document.querySelector('.hero-section');
    const timeline = document.querySelector('.timeline');
    
    if (window.innerWidth <= 768) {
        if (heroSection) {
            heroSection.style.flexDirection = 'column';
        }
    } else {
        if (heroSection) {
            heroSection.style.flexDirection = 'row';
        }
    }
    
    if (timeline) {
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const content = item.querySelector('.timeline-content');
            if (window.innerWidth <= 768) {
                content.style.width = 'calc(100% - 60px)';
                content.style.marginLeft = '60px';
                content.style.marginRight = '0';
            } else {
                content.style.width = '45%';
                content.style.marginLeft = index % 2 === 0 ? '55%' : '0';
                content.style.marginRight = index % 2 !== 0 ? '55%' : '0';
            }
        });
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// Export for external use
window.AboutPage = {
    switchTab,
    animateCounter,
    showLoading,
    hideLoading,
    initTabNavigation,
    initCounterAnimation,
    initScrollAnimations
};