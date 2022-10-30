const { MessageEmbed, Message } = require('discord.js');
const Gamedig = require('gamedig');

module.exports = {
	name: 'saembed',
	description: "Starts the players tracker",
		
	async execute(client, config, msg, args) {
        const explEmbed = new MessageEmbed()
        .setColor(config.default_embed_color)
        .setTitle(`Stormy's Wreckfest Server Activity`)
        //.setDescription(`Some description here`)
        .setThumbnail(config['images']['thumbnail'])
        .addFields(
            { name: `\u200B`, value: `
            This channel provides in real time the players online in Stormy's Wreckfest.
            Never miss a spot to join the server again, the list updates within 4 seconds when a player joins or leaves!

            *This functionality still in BETA version.
            Feel free to give feedback or let us know if you notice a bug.*
            \n` },
        )
        //.setImage(`https://i.imgur.com/AfFp7pu.png`)
        //.setTimestamp()
        .setFooter({ text: `Tracks names and images provided by WFServertracker.com`, iconURL: `http://www.borntorace.eu/wreckfest/discordbot/wfservertrackericon.png` });

        await msg.delete();
        msg.channel.send({ embeds: [explEmbed] });
	},
};