const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cornerbomb')
		.setDescription('What does "cornerbomb" mean ?'),
		
	async execute(interaction, config) {
		//Set embed
		const embed = new EmbedBuilder()
			.setColor(config.default_embed_color)
			.setTitle(`:question: Cornerbomb`)
			.setDescription(`A cornerbomber is a player who intentionally doesn't brake (or brakes too late) to ram the other players who are taking the turn properly.`)
			.setThumbnail(config['images']['thumbnail'])

		return interaction.reply({ embeds: [embed] });
	},
};