const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

class ModerationManager {
    constructor(client) {
        this.client = client;
    }

    async warnUser(interaction, targetUser, reason, database) {
        try {
            // Check permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return { success: false, message: 'You do not have permission to warn users!' };
            }

            // Add warning to database
            await database.addWarning(interaction.guild.id, targetUser.id, interaction.user.id, reason);
            
            // Get warning count
            const warningCount = await database.getWarningCount(interaction.guild.id, targetUser.id);
            
            // Get guild config
            const config = await database.getGuildConfig(interaction.guild.id);
            
            // Check for auto-warn
            if (warningCount >= config.auto_warn_threshold) {
                await this.autoWarn(interaction, targetUser, warningCount, database);
            }
            
            // Check for auto-ban
            if (warningCount >= config.auto_ban_threshold) {
                await this.autoBan(interaction, targetUser, warningCount, database);
                return { 
                    success: true, 
                    message: `**${targetUser.user.tag}** has been warned and automatically banned for reaching ${config.auto_ban_threshold} warnings!`,
                    autoAction: 'ban'
                };
            }

            // Log the warning
            await this.logAction(interaction, 'WARN', targetUser, reason, warningCount, database);

            return { 
                success: true, 
                message: `**${targetUser.user.tag}** has been warned! (${warningCount}/${config.auto_ban_threshold} warnings)`,
                warningCount: warningCount
            };
        } catch (error) {
            console.error('Error warning user:', error);
            return { success: false, message: 'Failed to warn user!' };
        }
    }

    async banUser(interaction, targetUser, reason, database) {
        try {
            // Check permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return { success: false, message: 'You do not have permission to ban users!' };
            }

            // Check if user is bannable
            if (!targetUser.bannable) {
                return { success: false, message: 'I cannot ban this user!' };
            }

            // Add ban to database
            await database.addBan(interaction.guild.id, targetUser.id, interaction.user.id, reason);
            
            // Ban the user
            await targetUser.ban({ reason: reason });
            
            // Log the ban
            await this.logAction(interaction, 'BAN', targetUser, reason, null, database);

            return { success: true, message: `**${targetUser.user.tag}** has been banned!` };
        } catch (error) {
            console.error('Error banning user:', error);
            return { success: false, message: 'Failed to ban user!' };
        }
    }

    async kickUser(interaction, targetUser, reason, database) {
        try {
            // Check permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                return { success: false, message: 'You do not have permission to kick users!' };
            }

            // Check if user is kickable
            if (!targetUser.kickable) {
                return { success: false, message: 'I cannot kick this user!' };
            }

            // Kick the user
            await targetUser.kick(reason);
            
            // Log the kick
            await this.logAction(interaction, 'KICK', targetUser, reason, null, database);

            return { success: true, message: `**${targetUser.user.tag}** has been kicked!` };
        } catch (error) {
            console.error('Error kicking user:', error);
            return { success: false, message: 'Failed to kick user!' };
        }
    }

    async autoWarn(interaction, targetUser, warningCount, database) {
        try {
            const config = await database.getGuildConfig(interaction.guild.id);
            
            // Send auto-warn message to user
            const dmEmbed = new EmbedBuilder()
                .setTitle('⚠️ Auto-Warning')
                .setDescription(`You have been automatically warned in **${interaction.guild.name}** for reaching ${warningCount} warnings.`)
                .setColor('#ffaa00')
                .setTimestamp();

            try {
                await targetUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log('Could not send DM to user');
            }

            // Log auto-warn
            await this.logAction(interaction, 'AUTO_WARN', targetUser, `Auto-warned for reaching ${warningCount} warnings`, warningCount, database);
        } catch (error) {
            console.error('Error in auto-warn:', error);
        }
    }

    async autoBan(interaction, targetUser, warningCount, database) {
        try {
            const config = await database.getGuildConfig(interaction.guild.id);
            
            // Add ban to database
            await database.addBan(interaction.guild.id, targetUser.id, this.client.user.id, `Auto-banned for reaching ${warningCount} warnings`);
            
            // Ban the user
            await targetUser.ban({ reason: `Auto-banned for reaching ${warningCount} warnings` });
            
            // Send auto-ban message to user
            const dmEmbed = new EmbedBuilder()
                .setTitle('🔨 Auto-Ban')
                .setDescription(`You have been automatically banned from **${interaction.guild.name}** for reaching ${warningCount} warnings.`)
                .setColor('#ff0000')
                .setTimestamp();

            try {
                await targetUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log('Could not send DM to user');
            }

            // Log auto-ban
            await this.logAction(interaction, 'AUTO_BAN', targetUser, `Auto-banned for reaching ${warningCount} warnings`, warningCount, database);
        } catch (error) {
            console.error('Error in auto-ban:', error);
        }
    }

    async logAction(interaction, action, targetUser, reason, warningCount, database) {
        try {
            const config = await database.getGuildConfig(interaction.guild.id);
            
            if (!config.log_channel_id) {
                return;
            }

            const logChannel = interaction.guild.channels.cache.get(config.log_channel_id);
            if (!logChannel) {
                return;
            }

            const colors = {
                'WARN': '#ffaa00',
                'BAN': '#ff0000',
                'KICK': '#ff8800',
                'AUTO_WARN': '#ffaa00',
                'AUTO_BAN': '#ff0000'
            };

            const embed = new EmbedBuilder()
                .setTitle(`🛡️ ${action.replace('_', ' ')}`)
                .setColor(colors[action] || '#0099ff')
                .addFields(
                    { name: 'User', value: `${targetUser.user.tag} (${targetUser.id})`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                    { name: 'Reason', value: reason || 'No reason provided', inline: false }
                )
                .setTimestamp();

            if (warningCount !== null) {
                embed.addFields({ name: 'Warning Count', value: warningCount.toString(), inline: true });
            }

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error logging action:', error);
        }
    }

    async getWarnings(interaction, targetUser, database) {
        try {
            const warnings = await database.getWarnings(interaction.guild.id, targetUser.id);
            
            if (warnings.length === 0) {
                return { success: true, message: `**${targetUser.user.tag}** has no warnings.`, warnings: [] };
            }

            const warningList = warnings.map((warning, index) => {
                const date = new Date(warning.timestamp).toLocaleDateString();
                return `${index + 1}. **${warning.reason}** - <@${warning.moderator_id}> (${date})`;
            }).join('\n');

            return { 
                success: true, 
                message: `**${targetUser.user.tag}**'s warnings:`,
                warnings: warnings,
                warningList: warningList
            };
        } catch (error) {
            console.error('Error getting warnings:', error);
            return { success: false, message: 'Failed to get warnings!' };
        }
    }

    async clearWarnings(interaction, targetUser, database) {
        try {
            // Check permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return { success: false, message: 'You do not have permission to clear warnings!' };
            }

            const warningCount = await database.getWarningCount(interaction.guild.id, targetUser.id);
            
            if (warningCount === 0) {
                return { success: false, message: `**${targetUser.user.tag}** has no warnings to clear!` };
            }

            // Clear warnings from database
            await database.run(
                'DELETE FROM user_warnings WHERE guild_id = ? AND user_id = ?',
                [interaction.guild.id, targetUser.id]
            );

            // Log the action
            await this.logAction(interaction, 'CLEAR_WARNINGS', targetUser, `Cleared ${warningCount} warnings`, 0, database);

            return { success: true, message: `Cleared ${warningCount} warnings for **${targetUser.user.tag}**!` };
        } catch (error) {
            console.error('Error clearing warnings:', error);
            return { success: false, message: 'Failed to clear warnings!' };
        }
    }
}

module.exports = ModerationManager;
