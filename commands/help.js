const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows the commands list'),
        
	async execute(interaction, config) {
        //Set embed
		const embed = new MessageEmbed()
            .setColor(config.default_embed_color)
            .setTitle(`:bulb: Commands\n\u200B`)
            .setThumbnail(config['images']['thumbnail'])
            .addFields(
                { name:`:page_with_curl: Rules of Stormy's Wreckfest`, value:`\`/rules\`\n\u200B`, inline:true},
                { name:`:question: Cornerbomb definition`, value:`\`/cornerbomb\`\n\u200B`, inline:true},
                { name:`:question: Grief definition`, value:`\`/grief\`\n\u200B`, inline:true},
                //{ name:`:busts_in_silhouette:  See who is online in Stormy's Wreckfest`, value:`\`/players\` or \`/playerstime\` \n*\`/players help\` for more informations*\n\u200B`, inline:true},
                { name:`:desktop: Useful links !`, value:`\`/links\`\n\u200B`, inline:true}
            )
            .setFooter(`Bot made by @bergaan#6292`)

		return interaction.reply({ embeds: [embed] });
	},
};
