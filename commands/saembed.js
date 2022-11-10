const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('saembed')
		.setDescription('PRIVATE COMMAND - explanative embed that comes before the Server Activity embed'),
		
	async execute(interaction, config) {
		const embed = new EmbedBuilder()
			.setColor(config.default_embed_color)
			.setTitle(`Stormy's Wreckfest Server Activity`)
			.setThumbnail(config['images']['thumbnail'])
            .addFields(
                { name: `\u200B`, value: `
                This channel provides in real time the players online in Stormy's Wreckfest.
                Never miss a spot to join the server again, the list updates within 4 seconds when a player joins or leaves!
    
                *This functionality still in BETA version.
                Feel free to give feedback or let us know if you notice a bug.*
                \n` },
            )
            .setFooter({ text: `Tracks names and images provided by WFServertracker.com`, iconURL: `http://www.borntorace.eu/wreckfest/discordbot/wfservertrackericon.png` });

		return interaction.reply({ embeds: [embed] });
	},
};