class SocialProofPopup {
    constructor() {
        this.container = document.getElementById('social-proof-container');
        this.currentPopup = null;
        this.isAnimating = false;
        this.config = null;
        this.initialize();
    }

    async initialize() {
        try {
            const response = await fetch('/api/config');
            this.config = await response.json();
            this.fetchAndShowPopup();
            
            // Use configured interval
            setInterval(() => this.fetchAndShowPopup(), this.config.timing.interval);
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    async fetchAndShowPopup() {
        if (this.isAnimating) {
            console.log('Animation in progress, skipping...');
            return;
        }

        try {
            const response = await fetch('/api/mock-purchase');
            const purchase = await response.json();
            await this.showPopup(purchase);
        } catch (error) {
            console.error('Error fetching purchase data:', error);
        }
    }

    showPopup(purchase) {
        return new Promise((resolve) => {
            this.isAnimating = true;

            const popup = document.createElement('div');
            popup.className = 'social-proof-popup';
            
            // Apply configured styles
            popup.style.fontFamily = this.config.style.fontFamily;
            popup.style.fontSize = this.config.style.fontSize;
            popup.style.backgroundColor = this.config.style.backgroundColor;
            popup.style.color = this.config.style.textColor;
            popup.style.borderRadius = this.config.style.borderRadius;
            popup.style.boxShadow = this.config.style.shadow;
            popup.style.maxWidth = this.config.display.maxWidth;

            // Set position and get slide direction
            const { slideInFrom, slideOutTo } = this.setPopupPosition(popup);

            // Initial state for animation
            popup.style.transform = slideInFrom;
            popup.style.opacity = '0';
            
            popup.innerHTML = this.buildPopupContent(purchase);

            this.container.appendChild(popup);
            this.currentPopup = popup;

            // Slide in
            setTimeout(() => {
                popup.style.transition = `all ${this.config.timing.animationDuration}ms ease-out`;
                popup.style.transform = 'translateX(0)';
                popup.style.opacity = '1';
            }, 100);

            // Slide out
            setTimeout(() => {
                popup.style.transform = slideOutTo;
                popup.style.opacity = '0';
                
                setTimeout(() => {
                    popup.remove();
                    this.isAnimating = false;
                    resolve();
                }, this.config.timing.animationDuration);
            }, this.config.timing.displayDuration);

            // Add close button functionality
            const closeBtn = popup.querySelector('.popup-close');
            closeBtn.addEventListener('click', () => {
                popup.style.transform = slideOutTo;
                popup.style.opacity = '0';
                
                setTimeout(() => {
                    popup.remove();
                    this.isAnimating = false;
                    resolve();
                }, this.config.timing.animationDuration);
            });
        });
    }

    setPopupPosition(popup) {
        let slideInFrom = 'X';
        let slideOutTo = 'X';
        let slideInValue = -100;  // Default slide from left
        let slideOutValue = -100; // Default slide to left

        switch (this.config.display.position) {
            case 'bottom-right':
            case 'top-right':
                popup.style.right = '20px';
                popup.style.left = 'auto';
                slideInValue = 100;  // Slide from right
                slideOutValue = 100; // Slide to right
                break;
            case 'bottom-left':
            case 'top-left':
                popup.style.left = '20px';
                popup.style.right = 'auto';
                slideInValue = -100;  // Slide from left
                slideOutValue = -100; // Slide to left
                break;
        }

        // Set vertical position
        if (this.config.display.position.startsWith('top')) {
            popup.style.top = '20px';
            popup.style.bottom = 'auto';
        } else {
            popup.style.bottom = '20px';
            popup.style.top = 'auto';
        }

        return { 
            slideInFrom: `translateX(${slideInValue}%)`,
            slideOutTo: `translateX(${slideOutValue}%)`
        };
    }

    buildPopupContent(purchase) {
        let html = '<div class="popup-close">&times;</div>';
        
        // Add product image container
        if (this.config.display.showImage) {
            html += `
                <div class="popup-image">
                    <img src="https://via.placeholder.com/50" alt="${purchase.productName}">
                </div>
            `;
        }

        html += '<div class="popup-text">';
        
        let content = this.config.text.template
            .replace('{customer}', `<span class="customer-name">${purchase.customerName}</span>`)
            .replace('{location}', `<span class="location">${purchase.location}</span>`)
            .replace('{product}', `<span class="product-name">${purchase.productName}</span>`);

        html += `<p>${content}`;
        
        if (this.config.display.showPrice) {
            html += ` for <span class="price">$${purchase.price}</span>`;
        }
        html += '</p>';

        if (this.config.display.showTimeAgo) {
            html += `<p class="time-ago">${purchase.timeAgo}</p>`;
        }

        html += '</div>'; // Close popup-text div

        return html;
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SocialProofPopup();
}); 