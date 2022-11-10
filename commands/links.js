const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('links')
		.setDescription('Shows a list of useful links'),
        
	async execute(interaction, config) {
        //Set embed
		const embed = new EmbedBuilder()
            .setColor(config.default_embed_color)
            .setTitle(`:desktop: Useful links\n\u200B`)
            .setThumbnail(config['images']['thumbnail'])
            .addFields(
                { name:`Stormy's Wreckfest Official Website`, value:`http://borntorace.eu/wreckfest\n\u200B`},
                { name:`Wreckfest Server Tracker`, value:`http://wfservertracker.com/server.html?id=${config.server_infos[0]['tracker_id']}\n\u200B`},
                { name:`Official Wreckfest Discord server`, value:`https://discord.com/invite/wreckfest\n\u200B`},
                { name:`How to find a Steam ID ?`, value:`http://borntorace.eu/wreckfest/findsteamid\n\u200B`},
                { name:`Make a donation to support servers hosting *(Paypal)*`, value:`http://borntorace.eu/donate`},
            )

		return interaction.reply({ embeds: [embed] });
	},
};