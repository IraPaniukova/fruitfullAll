export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
        return 'New';
    } else if (diffHours < 13) {
        return `${diffHours} hours ago`;
    } else if (diffDays <= 2) {
        return `${diffDays} days ago`;
    } else {
        return 'More than 2 days';
    }
};