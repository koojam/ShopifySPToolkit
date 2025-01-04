import React from 'react';
import { Card, Box, Text, Layout } from '@shopify/polaris';
import { formatTime } from '../../utils/timeFormat';

function NotificationPreview({ settings }) {
    const previewStyle = {
        maxWidth: settings.display.maxWidth,
        backgroundColor: `hsla(${settings.style.backgroundColor.hue}, ${settings.style.backgroundColor.saturation * 100}%, ${settings.style.backgroundColor.brightness * 100}%, ${settings.style.backgroundColor.alpha})`,
        color: `hsla(${settings.style.textColor.hue}, ${settings.style.textColor.saturation * 100}%, ${settings.style.textColor.brightness * 100}%, ${settings.style.textColor.alpha})`,
        padding: '12px 16px',
        borderRadius: settings.display.popupShape === 'rounded' ? '8px' : '0',
        boxShadow: settings.style.shadow,
        fontFamily: settings.style.fontFamily,
        fontSize: settings.style.fontSize,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid #e1e3e5'
    };

    const imageStyle = {
        width: settings.display.imageSize,
        height: settings.display.imageSize,
        backgroundColor: '#F4F4F4',
        borderRadius: settings.display.imageShape === 'rounded' ? '8px' : '0',
        border: settings.display.imageBorder ? '1px solid #E1E1E1' : 'none',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#919191',
        fontSize: '10px'
    };

    const contentStyle = {
        flex: 1,
        minWidth: 0,
        paddingRight: settings.display.allowClose ? '24px' : '0',
        lineHeight: '1.4'
    };

    const timeAgoStyle = {
        color: `hsla(${settings.style.textColor.hue}, ${settings.style.textColor.saturation * 100}%, ${settings.style.textColor.brightness * 100}%, 0.5)`,
        fontSize: '0.85em',
        marginTop: '4px'
    };

    const formatText = (text) => {
        // First replace variables
        let formattedText = text
            .replace('{customer}', 'Emma')
            .replace('{location}', 'Paris')
            .replace('{product}', 'Denim Jeans')
            .replace('{price}', '$89.99');

        // Then handle formatting
        // Split by formatting markers while keeping them
        const parts = formattedText.split(/(\*[^*]+\*|_[^_]+_|~[^~]+~)/g);

        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                // Bold text
                return <strong key={index}>{part.slice(1, -1)}</strong>;
            } else if (part.startsWith('_') && part.endsWith('_')) {
                // Italic text
                return <em key={index}>{part.slice(1, -1)}</em>;
            } else if (part.startsWith('~') && part.endsWith('~')) {
                // Underline text
                return <span key={index} style={{textDecoration: 'underline'}}>{part.slice(1, -1)}</span>;
            }
            return part;
        });
    };

    // Add timestamp to mock data
    const mockPurchase = {
        customer: 'Emma',
        location: 'Paris',
        product: 'Denim Jeans',
        price: 89.99,
        timestamp: Date.now() - 2 * 60 * 1000  // 2 minutes ago
    };

    // Format the time according to settings
    const timeAgo = formatTime(mockPurchase.timestamp, settings.text.timeAgoFormat);

    const closeButtonStyle = {
        position: 'absolute',
        top: '4px',
        right: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        color: `hsla(${settings.style.textColor.hue}, ${settings.style.textColor.saturation * 100}%, ${settings.style.textColor.brightness * 100}%, 0.5)`,
        border: 'none',
        padding: '4px',
        lineHeight: 1
    };

    return (
        <Layout.Section>
            <Card>
                <Box padding="4">
                    <Text variant="headingMd" as="h2">Preview</Text>
                    <Box 
                        paddingBlockStart="4" 
                        paddingBlockEnd="4" 
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '120px',
                            backgroundColor: '#f6f6f7',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{...previewStyle, position: 'relative'}}>
                            {settings.display.allowClose && (
                                <button 
                                    style={closeButtonStyle}
                                    aria-label="Close notification"
                                >
                                    ×
                                </button>
                            )}
                            {settings.display.showImage && (
                                <div style={imageStyle}>50×50</div>
                            )}
                            <div style={contentStyle}>
                                <div>{formatText(settings.text.template)}</div>
                                {settings.display.showTimeAgo && (
                                    <div style={timeAgoStyle}>
                                        {timeAgo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Box>
                </Box>
            </Card>
        </Layout.Section>
    );
}

export default NotificationPreview; 