const defaultConfig = {
    timing: {
        interval: 15000,        // Time between popups (15 seconds)
        displayDuration: 5000,  // How long each popup shows (5 seconds)
        animationDuration: 500  // Duration of slide animations
    },
    display: {
        showImage: true,        
        showTimeAgo: true,      
        showPrice: true,        
        maxWidth: '300px',      
        position: 'bottom-left', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        imageSize: '50px',      
        imageShape: 'rounded',  
        imageBorder: true,
        allowClose: true,
        popupShape: 'rounded'
    },
    style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        backgroundColor: { hue: 0, brightness: 1, saturation: 0, alpha: 1 }, // White
        textColor: { hue: 0, brightness: 0, saturation: 0, alpha: 1 },      // Black
        borderRadius: '8px',
        shadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    text: {
        template: '{customer} from {location} just purchased {product}',
        timeAgoFormat: 'relative'
    }
};

module.exports = defaultConfig; 