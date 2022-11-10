const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Shows the rules of Stromy\'s Wreckfests'),
        
	async execute(interaction, config) {
        //Set embed
        const embed = new EmbedBuilder()
            .setColor(config.default_embed_color)
            .setTitle(`:page_with_curl: Stormy's Wreckfest servers rules\n\u200B`)
            .setDescription(`\u200B`)
            .setThumbnail(config['images']['thumbnail'])
            .addFields(
                { name:`**:red_circle: ${config['server_infos'][0]['full_name']}**`, value:`\u200B`},//variable
                { name:`Parameters`, value:`• Class C\n• Realistic damages mode\n• 5 seconds reset delay\n• Special vehicles disabled`, inline:true},
                { name:`Rules`, value:`• No insults\n• No cornerbomb\n• Do not drive against traffic\n• No wallride\n• No grief\n\nFocus on racing, not on wrecking!`, inline:true}
            );

            //Set buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('cornerbomb')
                        .setLabel('Cornerbomb definition')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('grief')
                        .setLabel('Grief definition')
                        .setStyle(ButtonStyle.Secondary),
                );

		return interaction.reply({ embeds: [embed], components: [row] });
	},
};