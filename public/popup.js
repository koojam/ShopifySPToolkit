class SocialProofPopup {
    constructor() {
        this.container = document.getElementById('social-proof-container');
        this.currentPopup = null;
        this.isAnimating = false;
        this.fetchAndShowPopup();
        
        // Fetch new purchase data every 30 seconds
        setInterval(() => this.fetchAndShowPopup(), 30000);
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
            console.log('Showing new popup');

            // Create new popup
            const popup = document.createElement('div');
            popup.className = 'social-proof-popup';
            popup.style.transform = 'translateX(-100%)';
            popup.style.opacity = '0';
            
            popup.innerHTML = `
                <p>
                    <span class="customer-name">${purchase.customerName}</span> from 
                    <span class="location">${purchase.location}</span> just purchased a
                    <span class="product-name">${purchase.productName}</span> for 
                    <span class="price">$${purchase.price}</span>
                </p>
                <p class="time-ago">${purchase.timeAgo}</p>
            `;

            // Add to container
            this.container.appendChild(popup);
            this.currentPopup = popup;

            // Trigger slide in
            setTimeout(() => {
                popup.style.transition = 'all 0.5s ease-out';
                popup.style.transform = 'translateX(0)';
                popup.style.opacity = '1';
                console.log('Popup sliding in');
            }, 100);

            // Keep visible for 8 seconds
            setTimeout(() => {
                console.log('Starting popup removal');
                popup.style.transform = 'translateX(-100%)';
                popup.style.opacity = '0';
                
                // Remove from DOM after animation
                setTimeout(() => {
                    popup.remove();
                    this.isAnimating = false;
                    console.log('Popup removed');
                    resolve();
                }, 500);
            }, 8000);
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SocialProofPopup();
}); 