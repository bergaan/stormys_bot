const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cornerbomb')
		.setDescription('Shows the definition of "cornerbomb"'),
		
	async execute(interaction, config) {
		//Set embed
		const embed = new MessageEmbed()
			.setColor(config.default_embed_color)
			.setTitle(`:question: Cornerbomb`)
			.setDescription(`A cornerbomber is a player who intentionally doesn't brake (or brakes too late) to ram the other players who are taking the turn properly.`)
			.setThumbnail(config['images']['thumbnail'])

		return interaction.reply({ embeds: [embed] });
	},
};