class RatingSystem {
    constructor() {
        // DOM elements
        this.ratingCard = document.getElementById('rating-card');
        this.thankYouCard = document.getElementById('thank-you-card');
        this.submitButton = document.getElementById('submit-rating');
        this.ratingButtons = document.querySelectorAll('.rating-btn');
        this.ratingValue = document.getElementById('rating-value');
        
        // State
        this.selectedRating = 0;
        
        // Initialize
        this.init();
    }

    init() {
        try {
            this.validateElements();
            this.setupAccessibility();
            this.initializeRatingButtons();
            this.initializeSubmitButton();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    validateElements() {
        // Check if all required elements exist
        if (!this.ratingCard) throw new Error('Rating card not found');
        if (!this.thankYouCard) throw new Error('Thank you card not found');
        if (!this.submitButton) throw new Error('Submit button not found');
        if (!this.ratingButtons.length) throw new Error('Rating buttons not found');
        if (!this.ratingValue) throw new Error('Rating value element not found');
    }

    setupAccessibility() {
        // Add ARIA attributes and keyboard navigation
        this.ratingButtons.forEach((button, index) => {
            button.setAttribute('role', 'radio');
            button.setAttribute('aria-checked', 'false');
            button.setAttribute('aria-label', `Rate ${button.textContent} out of 5`);
            button.setAttribute('tabindex', '0');

            // Add keyboard support
            button.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleRatingSelection(button);
                }
            });
        });

        // Create rating group
        const ratingGroup = document.querySelector('.ratings');
        ratingGroup.setAttribute('role', 'radiogroup');
        ratingGroup.setAttribute('aria-label', 'Rating selection');
    }

    handleRatingSelection(selectedButton) {
        // Remove active state from all buttons
        this.ratingButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-checked', 'false');
        });
        
        // Add active state to selected button
        selectedButton.classList.add('active');
        selectedButton.setAttribute('aria-checked', 'true');
        
        // Store selected rating
        this.selectedRating = parseInt(selectedButton.textContent);

        // Enable submit button if it was disabled
        this.submitButton.disabled = false;
    }

    initializeRatingButtons() {
        this.ratingButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleRatingSelection(button);
            });
        });
    }

    initializeSubmitButton() {
        // Initially disable submit button
        this.submitButton.disabled = true;

        this.submitButton.addEventListener('click', () => {
            if (this.selectedRating > 0) {
                this.submitRating();
            } else {
                this.showError();
            }
        });
    }

    submitRating() {
        // Update rating display
        this.ratingValue.textContent = this.selectedRating;

        // Add animation classes
        this.ratingCard.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        setTimeout(() => {
            // Hide rating card and show thank you card
            this.ratingCard.classList.add('d-none');
            this.thankYouCard.classList.remove('d-none');
            
            // Animate thank you card
            this.thankYouCard.style.animation = 'fadeIn 0.3s ease-in forwards';
        }, 300);
    }

    showError() {
        // Create error message if it doesn't exist
        if (!document.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-danger m-2';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.textContent = 'Please select a rating before submitting';
            
            // Insert error message before submit button
            this.submitButton.parentNode.insertBefore(errorDiv, this.submitButton);
            
            // Remove error message after 3 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }
    }
}

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .error-message {
        font-size: 0.875rem;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Initialize the rating system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RatingSystem();
});