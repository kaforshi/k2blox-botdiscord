class DataStore {
    constructor() {
        this.embedData = new Map(); // Stores embed creation data by userId
        this.reviewData = new Map(); // Stores review submission data by userId
        
        // Cleanup old data every 30 minutes
        setInterval(() => {
            this.cleanup();
        }, 30 * 60 * 1000);
    }

    // Embed data methods
    setEmbedData(userId, data) {
        this.embedData.set(userId, {
            ...data,
            timestamp: Date.now()
        });
    }

    getEmbedData(userId) {
        return this.embedData.get(userId);
    }

    updateEmbedData(userId, updates) {
        const existing = this.embedData.get(userId);
        if (existing) {
            this.embedData.set(userId, {
                ...existing,
                ...updates,
                timestamp: Date.now()
            });
        }
    }

    clearEmbedData(userId) {
        this.embedData.delete(userId);
    }

    // Review data methods
    setReviewData(userId, data) {
        this.reviewData.set(userId, {
            ...data,
            timestamp: Date.now()
        });
    }

    getReviewData(userId) {
        return this.reviewData.get(userId);
    }

    updateReviewData(userId, updates) {
        const existing = this.reviewData.get(userId);
        if (existing) {
            this.reviewData.set(userId, {
                ...existing,
                ...updates,
                timestamp: Date.now()
            });
        }
    }

    clearReviewData(userId) {
        this.reviewData.delete(userId);
    }

    // Cleanup old data (older than 1 hour)
    cleanup() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const [key, value] of this.embedData.entries()) {
            if (value.timestamp < oneHourAgo) {
                this.embedData.delete(key);
            }
        }
        
        for (const [key, value] of this.reviewData.entries()) {
            if (value.timestamp < oneHourAgo) {
                this.reviewData.delete(key);
            }
        }
    }
}

module.exports = new DataStore();
