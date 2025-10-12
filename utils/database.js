const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const dbPath = process.env.DATABASE_PATH || './database.sqlite';
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('✅ Connected to SQLite database');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            // Guild configurations
            `CREATE TABLE IF NOT EXISTS guild_configs (
                guild_id TEXT PRIMARY KEY,
                prefix TEXT DEFAULT '!',
                welcome_channel_id TEXT,
                welcome_message TEXT DEFAULT 'Welcome {user} to {guild}!',
                log_channel_id TEXT,
                auto_warn_threshold INTEGER DEFAULT 3,
                auto_ban_threshold INTEGER DEFAULT 5,
                music_channel_id TEXT,
                spotify_enabled BOOLEAN DEFAULT 1,
                youtube_enabled BOOLEAN DEFAULT 1
            )`,

            // User warnings
            `CREATE TABLE IF NOT EXISTS user_warnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                moderator_id TEXT NOT NULL,
                reason TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (guild_id) REFERENCES guild_configs (guild_id)
            )`,

            // User bans
            `CREATE TABLE IF NOT EXISTS user_bans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                moderator_id TEXT NOT NULL,
                reason TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (guild_id) REFERENCES guild_configs (guild_id)
            )`,

            // Music queue
            `CREATE TABLE IF NOT EXISTS music_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                url TEXT NOT NULL,
                duration TEXT,
                thumbnail TEXT,
                position INTEGER DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Embed templates
            `CREATE TABLE IF NOT EXISTS embed_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT NOT NULL,
                name TEXT NOT NULL,
                title TEXT,
                description TEXT,
                color TEXT DEFAULT '#0099ff',
                fields TEXT,
                footer TEXT,
                thumbnail TEXT,
                image TEXT,
                timestamp BOOLEAN DEFAULT 0,
                UNIQUE(guild_id, name)
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Guild configuration methods
    async getGuildConfig(guildId) {
        const config = await this.get('SELECT * FROM guild_configs WHERE guild_id = ?', [guildId]);
        if (!config) {
            await this.run('INSERT INTO guild_configs (guild_id) VALUES (?)', [guildId]);
            return await this.get('SELECT * FROM guild_configs WHERE guild_id = ?', [guildId]);
        }
        return config;
    }

    async updateGuildConfig(guildId, updates) {
        const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(guildId);
        
        await this.run(`UPDATE guild_configs SET ${setClause} WHERE guild_id = ?`, values);
    }

    // Warning methods
    async addWarning(guildId, userId, moderatorId, reason) {
        await this.run(
            'INSERT INTO user_warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
            [guildId, userId, moderatorId, reason]
        );
    }

    async getWarnings(guildId, userId) {
        return await this.all(
            'SELECT * FROM user_warnings WHERE guild_id = ? AND user_id = ? ORDER BY timestamp DESC',
            [guildId, userId]
        );
    }

    async getWarningCount(guildId, userId) {
        const result = await this.get(
            'SELECT COUNT(*) as count FROM user_warnings WHERE guild_id = ? AND user_id = ?',
            [guildId, userId]
        );
        return result.count;
    }

    // Ban methods
    async addBan(guildId, userId, moderatorId, reason) {
        await this.run(
            'INSERT INTO user_bans (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
            [guildId, userId, moderatorId, reason]
        );
    }

    // Music queue methods
    async addToQueue(guildId, userId, title, url, duration, thumbnail) {
        await this.run(
            'INSERT INTO music_queue (guild_id, user_id, title, url, duration, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
            [guildId, userId, title, url, duration, thumbnail]
        );
    }

    async getQueue(guildId) {
        return await this.all(
            'SELECT * FROM music_queue WHERE guild_id = ? ORDER BY position ASC',
            [guildId]
        );
    }

    async clearQueue(guildId) {
        await this.run('DELETE FROM music_queue WHERE guild_id = ?', [guildId]);
    }

    // Embed template methods
    async saveEmbedTemplate(guildId, name, template) {
        await this.run(
            'INSERT OR REPLACE INTO embed_templates (guild_id, name, title, description, color, fields, footer, thumbnail, image, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [guildId, name, template.title, template.description, template.color, JSON.stringify(template.fields), template.footer, template.thumbnail, template.image, template.timestamp ? 1 : 0]
        );
    }

    async getEmbedTemplate(guildId, name) {
        const result = await this.get(
            'SELECT * FROM embed_templates WHERE guild_id = ? AND name = ?',
            [guildId, name]
        );
        if (result) {
            result.fields = JSON.parse(result.fields || '[]');
            result.timestamp = Boolean(result.timestamp);
        }
        return result;
    }

    async getEmbedTemplates(guildId) {
        return await this.all(
            'SELECT name, title, description FROM embed_templates WHERE guild_id = ?',
            [guildId]
        );
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database;
