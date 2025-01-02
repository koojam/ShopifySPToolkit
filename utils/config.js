const defaultConfig = {
    timing: {
        interval: 15000,        // Time between popups (30 seconds)
        displayDuration: 5000,  // How long each popup shows (8 seconds)
        animationDuration: 500  // Duration of slide animations
    },
    display: {
        showImage: true,        // Show product image
        showTimeAgo: true,      // Show when purchase happened
        showPrice: true,        // Show product price
        maxWidth: '300px',      // Popup width
        position: 'bottom-left',  // Try: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        showCloseButton: true,
        imageSize: '50px',        // Configurable image size
        imageShape: 'rounded',    // 'rounded', 'circle', or 'square'
        imageBorder: true
    },
    style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderRadius: '8px',
        shadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    text: {
        template: '{customer} from {location} just purchased {product}', // Customizable text template
        timeAgoFormat: 'relative'  // 'relative' or 'exact'
    }
};

module.exports = defaultConfig; 