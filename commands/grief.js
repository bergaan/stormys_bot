const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grief')
		.setDescription('What does "grief" mean ?'),
		
	async execute(interaction, config) {
		//Set embed
		const embed = new EmbedBuilder()
            .setColor(config.default_embed_color)
            .setTitle(`:question: Griefer`)
            .setDescription(`A griefer is a player who deliberately irritates and harasses other players within the game (trolling).`)
            .setThumbnail(config['images']['thumbnail'])

		return interaction.reply({ embeds: [embed] });
	},
};