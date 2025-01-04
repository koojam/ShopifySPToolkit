export function formatTime(timestamp, format) {
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