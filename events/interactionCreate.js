const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');
const dataStore = require('../utils/dataStore');
const database = require('../utils/database');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;

                await command.execute(interaction);
            } else if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'embed_type_selector') {
                    await handleEmbedTypeSelect(interaction);
                } else if (interaction.customId === 'review_rating_select') {
                    await handleReviewRatingSelect(interaction);
                } else if (interaction.customId === 'template_selector') {
                    await handleTemplateEmbedSelect(interaction);
                }
            } else if (interaction.isModalSubmit()) {
                if (interaction.customId === 'simple_embed_modal') {
                    await handleSimpleEmbedSubmit(interaction);
                } else if (interaction.customId === 'image_embed_modal') {
                    await handleImageEmbedSubmit(interaction);
                } else if (interaction.customId === 'fields_embed_modal') {
                    await handleFieldsEmbedSubmit(interaction);
                } else if (interaction.customId === 'complete_embed_modal') {
                    await handleCompleteEmbedSubmit(interaction);
                } else if (interaction.customId === 'review_comment_modal') {
                    await handleReviewCommentSubmit(interaction);
                }
            } else if (interaction.isButton()) {
                if (interaction.customId === 'confirm_send_embed') {
                    await handleConfirmSendEmbed(interaction);
                } else if (interaction.customId === 'cancel_send_embed') {
                    await handleCancelSendEmbed(interaction);
                }
            }
        } catch (error) {
            console.error('❌ Error Discord.js:', error);
        }
    }
};

async function handleEmbedTypeSelect(interaction) {
    try {
        const selectedType = interaction.values[0];
        const embedData = dataStore.getEmbedData(interaction.user.id);

        if (!embedData) {
            return await interaction.reply({
                content: '❌ Data embed tidak ditemukan. Silakan mulai ulang dengan /embed',
                ephemeral: true
            });
        }

        switch (selectedType) {
            case 'simple':
                await showSimpleEmbedModal(interaction);
                break;
            case 'image':
                await showImageEmbedModal(interaction);
                break;
            case 'fields':
                await showFieldsEmbedModal(interaction);
                break;
            case 'complete':
                await showCompleteEmbedModal(interaction);
                break;
            case 'template':
                await showTemplateEmbedModal(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Jenis embed tidak valid!',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error('Error handling embed type select:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat memproses pilihan embed.',
                ephemeral: true
            });
        }
    }
}

async function showSimpleEmbedModal(interaction) {
    try {
        const modal = new ModalBuilder()
            .setCustomId('simple_embed_modal')
            .setTitle('Embed Sederhana');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Judul Embed')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Masukkan judul embed...')
            .setRequired(true)
            .setMaxLength(256);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Deskripsi Embed')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Masukkan deskripsi embed...')
            .setRequired(true)
            .setMaxLength(4000);

        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color')
            .setLabel('Warna Embed (Hex Code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Contoh: #FF0000 atau FF0000')
            .setRequired(false)
            .setMaxLength(7);

        const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(colorInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Error showing simple embed modal:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menampilkan form embed.',
                ephemeral: true
            });
        }
    }
}

async function showImageEmbedModal(interaction) {
    try {
        const modal = new ModalBuilder()
            .setCustomId('image_embed_modal')
            .setTitle('Embed dengan Gambar');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Judul Embed')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Masukkan judul embed...')
            .setRequired(true)
            .setMaxLength(256);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Deskripsi Embed')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Masukkan deskripsi embed...')
            .setRequired(true)
            .setMaxLength(4000);

        const imageUrlInput = new TextInputBuilder()
            .setCustomId('embed_image_url')
            .setLabel('URL Gambar Besar')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/image.png')
            .setRequired(false);

        const thumbnailInput = new TextInputBuilder()
            .setCustomId('embed_thumbnail_url')
            .setLabel('URL Thumbnail')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/thumbnail.png')
            .setRequired(false);

        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color')
            .setLabel('Warna Embed (Hex Code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Contoh: #FF0000 atau FF0000')
            .setRequired(false)
            .setMaxLength(7);

        const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(imageUrlInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(thumbnailInput);
        const fifthActionRow = new ActionRowBuilder().addComponents(colorInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Error showing image embed modal:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menampilkan form embed.',
                ephemeral: true
            });
        }
    }
}

async function showFieldsEmbedModal(interaction) {
    try {
        const modal = new ModalBuilder()
            .setCustomId('fields_embed_modal')
            .setTitle('Embed dengan Fields');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Judul Embed')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Masukkan judul embed...')
            .setRequired(true)
            .setMaxLength(256);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Deskripsi Embed')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Masukkan deskripsi embed...')
            .setRequired(false)
            .setMaxLength(4000);

        const fieldsInput = new TextInputBuilder()
            .setCustomId('embed_fields')
            .setLabel('Fields (JSON Format)')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Contoh: [{"name":"Field 1","value":"Value 1","inline":true}]')
            .setRequired(false)
            .setMaxLength(4000);

        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color')
            .setLabel('Warna Embed (Hex Code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Contoh: #FF0000 atau FF0000')
            .setRequired(false)
            .setMaxLength(7);

        const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(fieldsInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(colorInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Error showing fields embed modal:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menampilkan form embed.',
                ephemeral: true
            });
        }
    }
}

async function showCompleteEmbedModal(interaction) {
    try {
        const modal = new ModalBuilder()
            .setCustomId('complete_embed_modal')
            .setTitle('Embed Lengkap');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Judul Embed')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Masukkan judul embed...')
            .setRequired(true)
            .setMaxLength(256);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Deskripsi Embed')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Masukkan deskripsi embed...')
            .setRequired(false)
            .setMaxLength(4000);

        const imageUrlInput = new TextInputBuilder()
            .setCustomId('embed_image_url')
            .setLabel('URL Gambar Besar')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/image.png')
            .setRequired(false);

        const footerInput = new TextInputBuilder()
            .setCustomId('embed_footer_text')
            .setLabel('Footer Text')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Masukkan teks footer...')
            .setRequired(false)
            .setMaxLength(2000);

        const authorInput = new TextInputBuilder()
            .setCustomId('embed_author_text')
            .setLabel('Author Text')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Masukkan teks author...')
            .setRequired(false)
            .setMaxLength(256);

        const authorIconInput = new TextInputBuilder()
            .setCustomId('embed_author_icon')
            .setLabel('Author Icon URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/icon.png')
            .setRequired(false);

        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color')
            .setLabel('Warna Embed (Hex Code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Contoh: #FF0000 atau FF0000')
            .setRequired(false)
            .setMaxLength(7);

        const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(imageUrlInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(footerInput);
        const fifthActionRow = new ActionRowBuilder().addComponents(authorInput);
        const sixthActionRow = new ActionRowBuilder().addComponents(authorIconInput);
        const seventhActionRow = new ActionRowBuilder().addComponents(colorInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow, sixthActionRow, seventhActionRow);
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Error showing complete embed modal:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menampilkan form embed.',
                ephemeral: true
            });
        }
    }
}

async function showTemplateEmbedModal(interaction) {
    try {
        const templates = await database.getAllTemplates(interaction.guild.id);
        
        if (templates.length === 0) {
            return await interaction.reply({
                content: '❌ Tidak ada template yang tersedia!',
                ephemeral: true
            });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('template_selector')
            .setPlaceholder('Pilih template yang ingin digunakan')
            .addOptions(templates.map(template => ({
                label: template.name,
                description: template.content.substring(0, 100) + '...',
                value: template.name
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: '📄 **Pilih Template**\n\nPilih template yang ingin Anda gunakan untuk embed:',
            components: [row],
            ephemeral: true
        });
    } catch (error) {
        console.error('Error showing template embed modal:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menampilkan template.',
                ephemeral: true
            });
        }
    }
}

async function handleSimpleEmbedSubmit(interaction) {
    try {
        const title = interaction.fields.getTextInputValue('embed_title');
        const description = interaction.fields.getTextInputValue('embed_description');
        const color = interaction.fields.getTextInputValue('embed_color');

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setAuthor({ 
                name: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            })
            .setFooter({ 
                text: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            });

        if (color) {
            let hexColor = color.replace('#', '');
            if (hexColor.length === 6) {
                embed.setColor(`#${hexColor}`);
            }
        }

        // Simpan embed ke dataStore
        const embedData = dataStore.getEmbedData(interaction.user.id);
        if (embedData) {
            embedData.embed = embed;
            dataStore.updateEmbedData(interaction.user.id, { embed: embed });
        }

        await showEmbedPreview(interaction);

    } catch (error) {
        console.error('Error handling simple embed submit:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat membuat embed!',
            ephemeral: true
        });
    }
}

async function handleImageEmbedSubmit(interaction) {
    try {
        const title = interaction.fields.getTextInputValue('embed_title');
        const description = interaction.fields.getTextInputValue('embed_description');
        const imageUrl = interaction.fields.getTextInputValue('embed_image_url');
        const thumbnailUrl = interaction.fields.getTextInputValue('embed_thumbnail_url');
        const color = interaction.fields.getTextInputValue('embed_color');

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setAuthor({ 
                name: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            })
            .setFooter({ 
                text: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            });

        if (imageUrl) embed.setImage(imageUrl);
        if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
        if (color) {
            let hexColor = color.replace('#', '');
            if (hexColor.length === 6) {
                embed.setColor(`#${hexColor}`);
            }
        }

        // Simpan embed ke dataStore
        const embedData = dataStore.getEmbedData(interaction.user.id);
        if (embedData) {
            embedData.embed = embed;
            dataStore.updateEmbedData(interaction.user.id, { embed: embed });
        }

        await showEmbedPreview(interaction);

    } catch (error) {
        console.error('Error handling image embed submit:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat membuat embed!',
            ephemeral: true
        });
    }
}

async function handleFieldsEmbedSubmit(interaction) {
    try {
        const title = interaction.fields.getTextInputValue('embed_title');
        const description = interaction.fields.getTextInputValue('embed_description');
        const fieldsJson = interaction.fields.getTextInputValue('embed_fields');
        const color = interaction.fields.getTextInputValue('embed_color');

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setAuthor({ 
                name: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            })
            .setFooter({ 
                text: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            });

        if (description) embed.setDescription(description);

        if (fieldsJson) {
            try {
                const fields = JSON.parse(fieldsJson);
                if (Array.isArray(fields)) {
                    const limitedFields = fields.slice(0, 25);
                    limitedFields.forEach(field => {
                        if (field.name && field.value) {
                            embed.addFields({
                                name: field.name,
                                value: field.value,
                                inline: field.inline || false
                            });
                        }
                    });
                }
            } catch (error) {
                return await interaction.reply({
                    content: '❌ Format JSON fields tidak valid! Pastikan format sesuai contoh.',
                    ephemeral: true
                });
            }
        }

        if (color) {
            let hexColor = color.replace('#', '');
            if (hexColor.length === 6) {
                embed.setColor(`#${hexColor}`);
            }
        }

        // Simpan embed ke dataStore
        const embedData = dataStore.getEmbedData(interaction.user.id);
        if (embedData) {
            embedData.embed = embed;
            dataStore.updateEmbedData(interaction.user.id, { embed: embed });
        }

        await showEmbedPreview(interaction);

    } catch (error) {
        console.error('Error handling fields embed submit:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat membuat embed!',
            ephemeral: true
        });
    }
}

async function handleCompleteEmbedSubmit(interaction) {
    try {
        const title = interaction.fields.getTextInputValue('embed_title');
        const description = interaction.fields.getTextInputValue('embed_description');
        const imageUrl = interaction.fields.getTextInputValue('embed_image_url');
        const footerText = interaction.fields.getTextInputValue('embed_footer_text');
        const authorText = interaction.fields.getTextInputValue('embed_author_text');
        const authorIcon = interaction.fields.getTextInputValue('embed_author_icon');
        const color = interaction.fields.getTextInputValue('embed_color');

        const embed = new EmbedBuilder()
            .setTitle(title);

        if (description) embed.setDescription(description);
        if (imageUrl) embed.setImage(imageUrl);

        // Set footer dengan default values
        embed.setFooter({ 
            text: footerText || 'K2BLOX', 
            iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
        });
        
        // Set author dengan default values
        embed.setAuthor({ 
            name: authorText || 'K2BLOX', 
            iconURL: authorIcon || 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
        });

        if (color) {
            let hexColor = color.replace('#', '');
            if (hexColor.length === 6) {
                embed.setColor(`#${hexColor}`);
            }
        }

        // Update data di store
        dataStore.updateEmbedData(interaction.user.id, { embed: embed });

        await showEmbedPreview(interaction);

    } catch (error) {
        console.error('Error handling complete embed submit:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat membuat embed!',
            ephemeral: true
        });
    }
}

async function handleTemplateEmbedSelect(interaction) {
    try {
        const templateName = interaction.values[0];
        const template = await database.getTemplate(interaction.guild.id, templateName);
        
        if (!template) {
            return await interaction.reply({
                content: '❌ Template tidak ditemukan!',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setDescription(template.content)
            .setAuthor({ 
                name: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            })
            .setFooter({ 
                text: 'K2BLOX', 
                iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68eedae2&is=68ed8962&hm=0f76c2147cc763633609502e751b27bde1e419a1851539f7f2797431a719b2a9&' 
            });

        if (template.imageUrl) {
            embed.setImage(template.imageUrl);
        }

        // Update data di store
        dataStore.updateEmbedData(interaction.user.id, { embed: embed });

        await showEmbedPreview(interaction);

    } catch (error) {
        console.error('Error handling template embed select:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat memproses template!',
            ephemeral: true
        });
    }
}

async function showEmbedPreview(interaction) {
    try {
        const embedData = dataStore.getEmbedData(interaction.user.id);
        
        if (!embedData || !embedData.embed) {
            return await interaction.reply({
                content: '❌ Data embed tidak ditemukan!',
                ephemeral: true
            });
        }

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_send_embed')
            .setLabel('✅ Kirim Embed')
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_send_embed')
            .setLabel('❌ Batal')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        await interaction.reply({
            content: `📝 **Preview Embed**\n\nChannel target: ${embedData.channel}\n\nApakah Anda ingin mengirim embed ini?`,
            embeds: [embedData.embed],
            components: [row],
            ephemeral: true
        });

    } catch (error) {
        console.error('Error showing embed preview:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat menampilkan preview!',
            ephemeral: true
        });
    }
}

async function handleConfirmSendEmbed(interaction) {
    try {
        const embedData = dataStore.getEmbedData(interaction.user.id);
        
        if (!embedData || !embedData.embed || !embedData.channel) {
            return await interaction.reply({
                content: '❌ Data embed tidak lengkap!',
                ephemeral: true
            });
        }

        // Kirim embed ke channel target
        await embedData.channel.send({ embeds: [embedData.embed] });

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Embed Berhasil Dikirim!')
            .setDescription(`Embed telah dikirim ke ${embedData.channel}`)
            .setColor('#00FF00')
            .setTimestamp();

        await interaction.update({
            content: '',
            embeds: [successEmbed],
            components: []
        });

        // Clear data setelah berhasil
        dataStore.clearEmbedData(interaction.user.id);

    } catch (error) {
        console.error('Error sending embed:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat mengirim embed!',
            ephemeral: true
        });
    }
}

async function handleCancelSendEmbed(interaction) {
    try {
        const cancelEmbed = new EmbedBuilder()
            .setTitle('❌ Embed Dibatalkan')
            .setDescription('Pembuatan embed telah dibatalkan.')
            .setColor('#FF0000')
            .setTimestamp();

        if (interaction.replied || interaction.deferred) {
            await interaction.update({
                content: '',
                embeds: [cancelEmbed],
                components: []
            });
        } else {
            await interaction.reply({
                content: '❌ **Embed dibatalkan!**',
                embeds: [cancelEmbed],
                components: []
            });
        }

        // Clear data setelah dibatalkan
        dataStore.clearEmbedData(interaction.user.id);
    } catch (error) {
        console.error('Error handling cancel embed:', error);
    }
}

async function handleReviewRatingSelect(interaction) {
    try {
        const rating = parseInt(interaction.values[0]);
        const stars = '⭐'.repeat(rating);
        
        dataStore.updateReviewData(interaction.user.id, { 
            rating: rating, 
            stars: stars 
        });

        const modal = new ModalBuilder()
            .setCustomId('review_comment_modal')
            .setTitle('Komentar Testimoni');

        const commentInput = new TextInputBuilder()
            .setCustomId('review_comment')
            .setLabel('Komentar/Testimoni Anda')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Tuliskan komentar atau testimoni Anda...')
            .setRequired(true)
            .setMaxLength(1000);

        const actionRow = new ActionRowBuilder().addComponents(commentInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } catch (error) {
        console.error('Error handling review rating select:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat memproses rating!',
            ephemeral: true
        });
    }
}

async function handleReviewCommentSubmit(interaction) {
    try {
        const comment = interaction.fields.getTextInputValue('review_comment');
        const reviewData = dataStore.getReviewData(interaction.user.id);

        if (!reviewData || !reviewData.rating || !reviewData.channel) {
            return await interaction.reply({
                content: '❌ Data review tidak lengkap! Silakan coba lagi.',
                ephemeral: true
            });
        }

        // Buat embed testimoni
        const reviewEmbed = new EmbedBuilder()
            .setTitle('⭐ Testimoni Baru!')
            .setDescription(`**Rating:** ${reviewData.stars} (${reviewData.rating}/5)\n\n**Komentar:**\n${comment}`)
            .setColor(getRatingColor(reviewData.rating))
            .setAuthor({
                name: interaction.user.displayName || interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setFooter({
                text: `Testimoni dari ${interaction.user.tag}`,
                iconURL: interaction.guild.iconURL()
            })
            .setTimestamp();

        // Kirim testimoni ke channel review
        await reviewData.channel.send({ embeds: [reviewEmbed] });

        // Konfirmasi ke user
        const confirmEmbed = new EmbedBuilder()
            .setTitle('✅ Testimoni Terkirim!')
            .setDescription('Terima kasih telah memberikan testimoni untuk server ini!')
            .setColor('#00FF00')
            .setTimestamp();

        await interaction.reply({ embeds: [confirmEmbed] });

        // Clear data setelah berhasil
        dataStore.clearReviewData(interaction.user.id);

    } catch (error) {
        console.error('Error handling review comment submit:', error);
        await interaction.reply({
            content: '❌ Terjadi kesalahan saat mengirim testimoni!',
            ephemeral: true
        });
    }
}

function getRatingColor(rating) {
    switch (rating) {
        case 1: return '#FF0000';
        case 2: return '#FF6600';
        case 3: return '#FFCC00';
        case 4: return '#66FF00';
        case 5: return '#00FF00';
        default: return '#0099FF';
    }
}
