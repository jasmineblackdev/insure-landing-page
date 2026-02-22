// View Plans JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initPlanToggle();
    initCoverageSlider();
    initFAQ();
    initPlanSelection();
    initScrollAnimations();
});

// Plan Type Toggle Functionality
function initPlanToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const plansSections = document.querySelectorAll('.plans-section');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and sections
            toggleBtns.forEach(b => b.classList.remove('active'));
            plansSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding plans section
            const planType = btn.getAttribute('data-type');
            const targetSection = document.getElementById(`${planType}-plans`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Scroll to plans section
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    });
}

// Coverage Amount Slider for Life Insurance
function initCoverageSlider() {
    const slider = document.getElementById('coverage-amount');
    const display = document.getElementById('coverage-display');
    const priceElements = document.querySelectorAll('#life-plans .amount[data-base-price]');

    if (slider && display) {
        // Update display and prices when slider changes
        slider.addEventListener('input', () => {
            const amount = parseInt(slider.value);
            display.textContent = formatCurrency(amount);
            updateLifeInsurancePrices(amount);
        });

        // Initialize display
        display.textContent = formatCurrency(parseInt(slider.value));
    }

    function updateLifeInsurancePrices(coverageAmount) {
        priceElements.forEach(element => {
            const basePrice = parseFloat(element.getAttribute('data-base-price'));
            const multiplier = coverageAmount / 500000; // Base calculation for $500k
            const newPrice = Math.round(basePrice * multiplier);
            
            // Add animation class
            element.classList.add('updating');
            
            setTimeout(() => {
                element.textContent = newPrice;
                element.classList.remove('updating');
            }, 150);
        });
    }

    function formatCurrency(amount) {
        return amount.toLocaleString('en-US');
    }
}

// FAQ Accordion Functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });

            // Toggle current FAQ item
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });
}

// Plan Selection Functionality
function initPlanSelection() {
    const selectButtons = document.querySelectorAll('.select-plan-btn');
    const compareBtn = document.querySelector('.compare-btn');
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    let selectedPlans = new Set();

    selectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const planId = btn.getAttribute('data-plan');
            
            if (selectedPlans.has(planId)) {
                // Deselect plan
                selectedPlans.delete(planId);
                btn.textContent = btn.textContent.replace('Selected: ', 'Select ');
                btn.classList.remove('selected');
            } else {
                // Select plan
                selectedPlans.add(planId);
                btn.textContent = 'Selected: ' + btn.textContent.replace('Select ', '');
                btn.classList.add('selected');
            }

            updateCompareButton();
            
            // Scroll to next section or show success message
            if (selectedPlans.size === 1) {
                showPlanSelectedMessage(planId);
                setTimeout(() => {
                    document.getElementById('compare-plans').scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 1000);
            }
        });
    });

    // Compare button functionality
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            if (selectedPlans.size > 0) {
                showComparisonModal(Array.from(selectedPlans));
            } else {
                showNotification('Please select at least one plan to compare', 'warning');
            }
        });
    }

    // CTA buttons
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('cta-primary')) {
                handleGetQuote();
            } else {
                handleSpeakWithAdvisor();
            }
        });
    });

    function updateCompareButton() {
        if (compareBtn) {
            const count = selectedPlans.size;
            if (count === 0) {
                compareBtn.textContent = 'Compare Selected Plans';
                compareBtn.disabled = false;
            } else if (count === 1) {
                compareBtn.textContent = 'Add Another Plan to Compare';
                compareBtn.disabled = false;
            } else {
                compareBtn.textContent = `Compare ${count} Selected Plans`;
                compareBtn.disabled = false;
            }
        }
    }

    function showPlanSelectedMessage(planId) {
        const planName = planId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        showNotification(`${planName} plan selected! You can add more plans for comparison.`, 'success');
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
        observer.observe(card);
    });

    // Observe FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        observer.observe(item);
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #2ecc71;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            .notification-warning {
                border-left-color: #f39c12;
            }
            .notification-error {
                border-left-color: #e74c3c;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }
            .notification-message {
                font-family: 'Karla', sans-serif;
                color: var(--blue-950);
                font-size: 14px;
                line-height: 1.4;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                color: var(--gray-700);
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                color: var(--blue-950);
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function showComparisonModal(planIds) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'comparison-modal-overlay';
    
    const planNames = planIds.map(id => 
        id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ');
    
    modal.innerHTML = `
        <div class="comparison-modal">
            <div class="modal-header">
                <h3>Plan Comparison</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>You've selected: <strong>${planNames}</strong></p>
                <p>Our comparison tool is coming soon! In the meantime, our advisors can help you compare these plans and find the perfect fit for your needs.</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="handleSpeakWithAdvisor()">Speak with Advisor</button>
                    <button class="btn-secondary" onclick="handleGetQuote()">Get Quote</button>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    if (!document.getElementById('modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .comparison-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .comparison-modal-overlay.show {
                opacity: 1;
            }
            .comparison-modal {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            .comparison-modal-overlay.show .comparison-modal {
                transform: scale(1);
            }
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px;
                border-bottom: 1px solid var(--gray-50);
            }
            .modal-header h3 {
                font-family: 'DM Serif Display', serif;
                font-size: 24px;
                color: var(--blue-950);
                margin: 0;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: var(--gray-700);
                cursor: pointer;
                padding: 4px;
                line-height: 1;
            }
            .modal-close:hover {
                color: var(--blue-950);
            }
            .modal-body {
                padding: 24px;
            }
            .modal-body p {
                font-family: 'Karla', sans-serif;
                color: var(--gray-700);
                line-height: 1.6;
                margin-bottom: 16px;
            }
            .modal-actions {
                display: flex;
                gap: 16px;
                margin-top: 24px;
            }
            .btn-primary, .btn-secondary {
                flex: 1;
                padding: 14px 20px;
                border-radius: 8px;
                font-family: 'Karla', sans-serif;
                font-weight: 700;
                font-size: 13px;
                letter-spacing: 1px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .btn-primary {
                background: var(--blue-950);
                color: white;
                border: 2px solid var(--blue-950);
            }
            .btn-primary:hover {
                background: var(--gray-950);
                border-color: var(--gray-950);
            }
            .btn-secondary {
                background: transparent;
                color: var(--blue-950);
                border: 2px solid var(--blue-950);
            }
            .btn-secondary:hover {
                background: var(--blue-950);
                color: white;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(modal);

    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);

    // Close modal functionality
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Make closeModal available globally
    window.closeComparisonModal = closeModal;
}

function handleGetQuote() {
    showNotification('Redirecting to quote form...', 'info');
    // In a real application, this would redirect to a quote form
    setTimeout(() => {
        console.log('Navigate to quote form');
    }, 1500);
}

function handleSpeakWithAdvisor() {
    showNotification('Connecting you with an advisor...', 'info');
    // In a real application, this would open a chat widget or schedule a call
    setTimeout(() => {
        console.log('Open advisor chat/contact form');
    }, 1500);
}

// Add CSS class for selected plan buttons
const additionalStyles = `
    .select-plan-btn.selected {
        background-color: #2ecc71 !important;
        border-color: #2ecc71 !important;
    }
    .select-plan-btn.selected:hover {
        background-color: #27ae60 !important;
    }
    .plan-card.animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    .faq-item.animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add the additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);