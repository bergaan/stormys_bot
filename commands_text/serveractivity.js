const { MessageEmbed } = require('discord.js');
//const fs = require('fs');
//const readline = require('readline');
const fetch = require('node-fetch');
const Gamedig = require('gamedig');

module.exports = {
	name: 'serveractivity',
	description: "Starts the players tracker",
		
	async execute(client, config, msg, args) {

        function sec2time(timeInSeconds) {
            let pad = function(num, size) { return ('000' + num).slice(size * -1); },
            timeRaw = parseFloat(timeInSeconds).toFixed(3),
            timeHrs = Math.floor(timeRaw / 60 / 60),
            timeMin = Math.floor(timeRaw / 60) % 60,
            timeSec = Math.floor(timeRaw % 60);
            
            return pad(timeHrs, 2) + ':' + pad(timeMin, 2) + ':' + pad(timeSec, 2);
        }
        

        //Check if admin
        /* let isAdmin = false;
        for (let i=0; i<Object.keys(config['admin_id']).length; i++)//Check if user is admin
        {
            if(msg.author.id == config['admin_id'][i]) isAdmin = true;
        }

        //Handle the errors in the command
        if(isAdmin != true) {
            console.error('Error in user input - User is not admin');
            msg.delete();
            return;
        } */
        if(!args[0]) {//if no arg
            console.error('Error in user input - Need an argument');
            msg.delete();
            return;
        }
        else if(!config.server_infos[args[0]]) {//if server ID doesnt exist
            console.error('Error in user input - Unknown server ID');
            msg.delete();
            return;
        }
        else {//Check if command sent in a correct channel
            let correctChannel = false;
            for (let i=0; i<Object.keys(config['sa_channel']).length; i++)
            {
                if(msg.channel.id == config['sa_channel'][i]) correctChannel = true;
            }
            if(correctChannel != true) {
                console.error('Error in user input - Command sent in wrong channel');
                msg.delete();
                return;
            }
        }
        await msg.delete();

        const init_embed = new MessageEmbed()
            .setTitle(`Initialization...`);

        msg.channel.send({ embeds: [init_embed] })
        .then((message) => {
            const server_id = args[0];
            const clock = setInterval(serverQuery, 4000);//4 seconds interval
            const messageid = message.id;

            let infos_str_old = '';
            let infos_str_new = '';
            let track_id_old ='';
            let track_id = '';
            let buffer = 0;
            
            async function serverQuery() {
                //console.log(message);//debug
                Gamedig.query({
                    type: 'protocol-valve',
                    host: config.server_infos[server_id]['ip'],
                    port: config.server_infos[server_id]['port'],
                    maxAttempts: 1,
                    socketTimeout: 2000,
                    attemptTimeout: 3800,
                    givenPortOnly: true
                }).then((res) => {
                    //console.log(res);//debug
                    //buffer = 10000;//debug
                   
                    //Create a string with all infos that can trigger a update (players list, track id, laps left, gamemode)
                    //1=laps_left, 2=track_id, 4=gamemode
                    infos_str_old = infos_str_new;
                    infos_str_new = '';
                    track_id_old = track_id;
                    track_id = res['raw']['tags'][2];
                    //console.log(track_id+'-'+track_id_old);//debug
                    //put elements that can trigger an update into an array
                    info_laps_left = res['raw']['tags'][1];
                    infos_str_new += `${info_laps_left},${track_id},${res['raw']['tags'][4]},`;
                    for(let i=0; i<res['players'].length; i++) {
                        if(res['players'][i]['name']) infos_str_new += escape(res['players'][i]['name']);
                        else infos_str_new += 'nd'+i;//if player name is Not Defined
                    }
                    //console.log(infos_str_new);//debug

                    if (infos_str_old != infos_str_new ||
                        res['players'].length>=17 && buffer>=5 ||//20s
                        res['players'].length>=9 && buffer>=10 ||//40s
                        res['players'].length>=1 && buffer>=30 ||//120s
                        res['players'].length>=0 && buffer>=75)//300s
                    {
                        //console.log('update embed');//debug
                        buffer = 1;
                        //Players list
                        let players_list = '';
                        if(res['players'].length > 0) {
                            //Create the players list string
                            const chars = {'\\':'\\\\', '*':'\\*', '_':'\\_', '~':'\\~', '`':'\\`', '|':'\\|', '>':'\\>'};
                            for (let p of res['players']) {
                                //player time
                                if(!p['raw']['time']) player_time = sec2time(0);
                                else player_time = sec2time(Math.ceil(p['raw']['time']));//upper rounding + format time
                                //player name
                                let player_name = p['name'].replace(/[*_~`|>\\]/g, m => chars[m]);//escape formating characters
                                if(p['name']) players_list += `\`${player_time}\` ${player_name}\n`;
                                else players_list += `\`${player_time}\` _Player${res['players'].indexOf(p)+1}_\n`;
                            }
                        }
                        else {
                            players_list = 'No players online :cry:\n';
                        }

                        //Call WFServerTracker to get track name, track image
                        let url = `http://wfservertracker.com/api/tracks?id=${track_id}`;
                        let settings = { method: "Get" };
                        fetch(url, settings)
                        .then(res => res.json())
                        .then((json) => {
                            let track_img;
                            let track_loc;
                            if(json.id) {
                                track_img = json.image;
                                track_loc = json.location;
                            }
                            else {
                                track_img = 'modtrack.png';
                                track_loc = 'Unknown';
                            }
                            //console.log(`${track.location} - ${res['map']}`);//debug
                            //console.log(track_img);//debug

                            let embedDescription = `**${track_loc} - ${res['map']}** \u200B `;
                        
                            //embedDescription += '*';//Italic text
                            switch (parseInt(res['raw']['tags'][4])) {
                                case 1://Banger Race
                                    embedDescription += '(Banger Race)\n';
                                    if(res['raw']['tags'][1] == '0') embedDescription += '***In Lobby***';
                                    else embedDescription += `***Lap ${(res['raw']['tags'][7]-res['raw']['tags'][1]+1)}/${res['raw']['tags'][7]}***`;
                                    break;
                                case 8://Team Race
                                    embedDescription += '(Team Race)\n';
                                    if(res['raw']['tags'][1] == '0') embedDescription += '***In Lobby***';
                                    else embedDescription += `***Lap ${(res['raw']['tags'][7]-res['raw']['tags'][1]+1)}/${res['raw']['tags'][7]}***`;
                                    break;
                                case 9://Elimination Race
                                    embedDescription += '(Elimination Race)\n';
                                    if(res['raw']['tags'][1] == '0') embedDescription += '***In Lobby***';
                                    else embedDescription += `***${res['raw']['tags'][1]} players alive***`;
                                    break;
                                case 4://Last Man Standing
                                    embedDescription += '(Last Man Standing)\n';
                                    if(res['raw']['tags'][1] == '0') embedDescription += '***In Lobby***';
                                    else embedDescription += `***${res['raw']['tags'][1]} players alive***`;
                                    break;
                                case 5://Deathmatch
                                    embedDescription += '(Deathmatch)\n';
                                    if(res['raw']['tags'][1] == '0') embedDescription += '***In Lobby***';
                                    else embedDescription += `***${res['raw']['tags'][1]} min left***`;
                                    break;
                                case 6://Team Deathmatch
                                    embedDescription += '(Team Deathmatch)\n';
                                    if(res['raw']['tags'][1] == '0') embedDescription += '***In Lobby***';
                                    else embedDescription += `***${res['raw']['tags'][1]} min left***`;
                                    break;
                                default:
                                    console.error('Gamemode not found');
                                    embedDescription += 'Unknown gamemode';
                                    break;
                            }
                            
                            //Free spot message
                            //embedDescription += `Drytown Desert Reverse Hardcore - Rally Circuit Reverse | ${}`;//debug
                            let footer_text;
                            let footer_img
                            if(res['players'].length < res['maxplayers']) {
                                footer_img = 'http://www.borntorace.eu/wreckfest/discordbot/sa_green_64.jpg';
                                if(res['maxplayers']-res['players'].length > 1) footer_text = `${res['maxplayers']-res['players'].length} spots available\nLast update`;
                                else footer_text = `${res['maxplayers']-res['players'].length} spot available\nLast update`; //just to remove "s" if only 1 spot
                            }
                            else {
                                footer_img = 'http://www.borntorace.eu/wreckfest/discordbot/sa_red_64.jpg';
                                footer_text = `No spot available\nLast update`
                            }

                            //Edit the embed
                            let embed = new MessageEmbed()
                                .setColor(config.server_infos[server_id]['embed_color'])
                                .setTitle(res['name'].replace(/\^./g,''))//remove the ^ formating characters (doesnt handle the double ^^)
                                .setDescription(`${embedDescription}\n\n\u200B`)
                                .setThumbnail(`http://wfservertracker.com/content/tracks/${track_img}`)
                                .addFields(
                                    { name:`\nPlayers: ${res['players'].length}/${res['maxplayers']}\n\u200B`, value:`${players_list}\u200B\n\u200B`},
                                )
                                .setTimestamp()
                                .setFooter({ text: footer_text, iconURL: footer_img });
                                
                            message.edit({ embeds: [embed] })
                            .catch((err) => {
                                //console.error(Date(), `Error on editing message. Server Activity update stopped in ${message.channel.name}.\n${err}`);//old
                                console.error(Date(), `Error on editing message.\n${err}`);
                                if(err == 'DiscordAPIError: Unknown Message') {
                                    //console.error('CATCHED IT!!!!!!!!!!!!!');//debug
                                    clearInterval(clock);//don't stop the refresh on editing error anymore
                                    console.error("Original message has been deleted. Service stopped")
                                    //message.channel.send('Error. Service stopped.');
                                    return;
                                }
                                return;
                            })
                        });
                    }
                    else {
                        buffer++;
                    }
                }).catch((err) => {
                    console.error(`${Date()} | Query error. [Server id:${server_id}][Channel:${message.channel.name}]\n${err}`);
                    return;
                });
            }
        })
        .catch((err) => {
            console.error('err message promise');
            console.error(Date() + err);
        })
	},
};