// This is the client-side code that runs in the browser
(function() {
    // Time formatting utility function
    function formatTime(timestamp, format) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        switch(format) {
            case 'relative':
                if (diffInMinutes < 1) return 'just now';
                if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
                const hours = Math.floor(diffInMinutes / 60);
                if (hours < 24) return `${hours} hours ago`;
                return `${Math.floor(hours / 24)} days ago`;
                
            case 'short':
                if (diffInMinutes < 1) return 'now';
                if (diffInMinutes < 60) return `${diffInMinutes}m`;
                if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
                return `${Math.floor(diffInMinutes / 1440)}d`;
                
            case 'exact':
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
            case 'full':
                return date.toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric'
                });
                
            default:
                return 'Invalid format';
        }
    }

    const popup = {
        settings: null,
        timer: null,

        init: async function() {
            try {
                // Fetch settings from our API
                const response = await fetch('http://localhost:4000/api/settings');
                this.settings = await response.json();
                
                // Initialize popup with settings
                this.createPopup();
                
                // Start notification cycle
                this.startNotificationCycle();
            } catch (error) {
                console.error('Failed to initialize popup:', error);
            }
        },

        createPopup: function() {
            // Create popup element
            const popup = document.createElement('div');
            popup.id = 'social-proof-popup';
            
            // Apply style settings
            popup.style.display = 'none';
            popup.style.position = 'fixed';
            popup.style.maxWidth = this.settings.display.maxWidth;
            popup.style.fontFamily = this.settings.style.fontFamily;
            popup.style.fontSize = this.settings.style.fontSize;
            popup.style.borderRadius = this.settings.display.popupShape === 'rounded' ? '8px' : '0';
            popup.style.boxShadow = this.settings.style.shadow;
            popup.style.padding = '15px';
            popup.style.zIndex = '1000';
            
            // Reset all positions first
            popup.style.top = 'auto';
            popup.style.bottom = 'auto';
            popup.style.left = 'auto';
            popup.style.right = 'auto';
            
            // Apply position based on settings
            switch(this.settings.display.position) {
                case 'top-left':
                    popup.style.top = '20px';
                    popup.style.left = '20px';
                    break;
                case 'top-right':
                    popup.style.top = '20px';
                    popup.style.right = '20px';
                    break;
                case 'bottom-left':
                    popup.style.bottom = '20px';
                    popup.style.left = '20px';
                    break;
                case 'bottom-right':
                    popup.style.bottom = '20px';
                    popup.style.right = '20px';
                    break;
            }

            // Apply colors
            const bg = this.settings.style.backgroundColor;
            const text = this.settings.style.textColor;
            popup.style.backgroundColor = `hsla(${bg.hue}, ${bg.saturation * 100}%, ${bg.brightness * 100}%, ${bg.alpha})`;
            popup.style.color = `hsla(${text.hue}, ${text.saturation * 100}%, ${text.brightness * 100}%, ${text.alpha})`;
            
            document.body.appendChild(popup);
        },

        startNotificationCycle: async function() {
            const showNotification = async () => {
                try {
                    const response = await fetch('http://localhost:4000/api/mock-purchase');
                    const purchase = await response.json();
                    this.showNotification(purchase);

                    // Hide after display duration
                    setTimeout(() => {
                        this.hideNotification();
                    }, this.settings.timing.displayDuration);

                } catch (error) {
                    console.error('Failed to fetch purchase:', error);
                }
            };

            // Show first notification
            showNotification();

            // Set up interval for future notifications
            this.timer = setInterval(showNotification, this.settings.timing.interval);
        },

        showNotification: function(purchase) {
            const text = this.settings.style.textColor;
            const popup = document.getElementById('social-proof-popup');
            popup.innerHTML = '';
            
            // Create container for flex layout
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '12px';
            container.style.position = 'relative';
            container.style.padding = '4px 8px';
            
            // Add close button if enabled
            if (this.settings.display.allowClose) {
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '×';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '-4px';
                closeButton.style.right = '-4px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.fontSize = '16px';
                closeButton.style.width = '20px';
                closeButton.style.height = '20px';
                closeButton.style.display = 'flex';
                closeButton.style.alignItems = 'center';
                closeButton.style.justifyContent = 'center';
                closeButton.style.borderRadius = '50%';
                closeButton.style.backgroundColor = 'transparent';
                closeButton.style.color = `hsla(${text.hue}, ${text.saturation * 100}%, ${text.brightness * 100}%, 0.5)`;
                closeButton.style.border = 'none';
                closeButton.style.padding = '0';
                closeButton.style.lineHeight = '1';
                closeButton.setAttribute('aria-label', 'Close notification');
                
                // Add click handler
                closeButton.addEventListener('click', () => {
                    this.hideNotification();
                });
                
                container.appendChild(closeButton);
            }

            // Add image if enabled
            if (this.settings.display.showImage) {
                const img = document.createElement('div');
                img.style.width = this.settings.display.imageSize;
                img.style.height = this.settings.display.imageSize;
                img.style.backgroundColor = '#f0f0f0';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.style.borderRadius = this.settings.display.imageShape === 'rounded' ? '8px' : '0';
                if (this.settings.display.imageBorder) {
                    img.style.border = '1px solid #e1e3e5';
                }
                img.textContent = '50×50';
                container.appendChild(img);
            }
            
            // Add text content
            const textContent = document.createElement('div');
            textContent.style.flex = '1';
            textContent.style.minWidth = '0';
            textContent.style.paddingRight = this.settings.display.allowClose ? '12px' : '0';
            textContent.style.lineHeight = '1.4';
            
            let message = this.settings.text.template
                .replace('{customer}', purchase.customer)
                .replace('{location}', purchase.location)
                .replace('{product}', purchase.product)
                .replace('{price}', `$${purchase.price.toFixed(2)}`);

            // Handle text formatting (bold, italic, underline)
            message = message.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                            .replace(/_(.*?)_/g, '<em>$1</em>')
                            .replace(/~(.*?)~/g, '<u>$1</u>');

            textContent.innerHTML = message;
            
            // Add time ago text
            if (this.settings.display.showTimeAgo) {
                const timeAgo = document.createElement('div');
                timeAgo.style.color = `hsla(${text.hue}, ${text.saturation * 100}%, ${text.brightness * 100}%, 0.5)`;
                timeAgo.style.fontSize = '0.85em';
                timeAgo.style.marginTop = '4px';
                timeAgo.textContent = formatTime(purchase.timestamp, this.settings.text.timeAgoFormat);
                textContent.appendChild(timeAgo);
            }
            
            container.appendChild(textContent);
            
            popup.appendChild(container);

            // Show with position-based animation
            popup.style.display = 'block';
            popup.style.opacity = '0';
            
            // Determine animation based on position
            const position = this.settings.display.position;
            if (position.includes('right')) {
                popup.style.transform = 'translateX(20px)';  // Slide from right
            } else {
                popup.style.transform = 'translateX(-20px)'; // Slide from left
            }
            
            popup.style.transition = `all ${this.settings.timing.animationDuration}ms ease-out`;
            
            setTimeout(() => {
                popup.style.opacity = '1';
                popup.style.transform = 'translateX(0)';
            }, 10);
        },

        hideNotification: function() {
            const popup = document.getElementById('social-proof-popup');
            const position = this.settings.display.position;
            
            popup.style.opacity = '0';
            if (position.includes('right')) {
                popup.style.transform = 'translateX(20px)';  // Slide to right
            } else {
                popup.style.transform = 'translateX(-20px)'; // Slide to left
            }
            
            setTimeout(() => {
                popup.style.display = 'none';
            }, this.settings.timing.animationDuration);
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => popup.init());
})(); 