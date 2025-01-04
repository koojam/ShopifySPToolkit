import React from 'react';
import { Box, Text } from '@shopify/polaris';

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

function TimeFormatPreview({ format }) {
    // Create sample timestamps
    const now = new Date();
    const timestamps = [
        now.getTime(),                    // Now
        now.getTime() - 5 * 60 * 1000,   // 5 minutes ago
        now.getTime() - 2 * 3600 * 1000, // 2 hours ago
        now.getTime() - 2 * 86400 * 1000 // 2 days ago
    ];

    return (
        <Box paddingBlockStart="3">
            <Text color="subdued" as="span">Preview: </Text>
            {timestamps.map((timestamp, index) => (
                <Text key={index} as="span" color="subdued">
                    {formatTime(timestamp, format)}
                    {index < timestamps.length - 1 ? ' • ' : ''}
                </Text>
            ))}
        </Box>
    );
}

export default TimeFormatPreview; 