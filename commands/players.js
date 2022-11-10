
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('players')
		.setDescription(`See the players online on Stormy's Wreckfest`),
	async execute(interaction, config) {
		await fetch(`http://wfservertracker.com/api/serverview?id=${config['server_infos'][0]['tracker_id']}`)
		.then((response) => response.json())
		.then((data) =>  {
			//console.log(data.players.length);//debug
			//console.log(data);//debug
			let players_list = '';
			if(data.players.length > 0) {
				
				for(let i=0; i<data.players.length; i++) {
					console.log(data['players'][i]['name']);//debug
					players_list += data['players'][i]['name']+'\n';
				}
				players_list += '\u200B';
			} 
			else {
				players_list = 'No players online :cry:\n\u200B';
			}

			//Set embed
			const embed = new EmbedBuilder()
			.setColor(config['server_infos'][0]['embed_color'])
			.setTitle(`Players (${data.onlineplayers}/${data.maxplayers})`)
			.setAuthor({ name: data.nametext })
			.setThumbnail(config['images']['thumbnail'])
			.addFields(
				{ name: '\u200B', value: players_list }
			)
			.setFooter({ text: 'Datas provided by wfservertracker.com', iconURL: 'http://www.borntorace.eu/wreckfest/discordbot/wfservertrackericon.png' });

			return interaction.reply({ embeds: [embed] });
		})
	},
};