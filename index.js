const fs = require('fs'); //Read/Edit files module
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');

const config = require('./config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

//Collection of text commands
client.textCommands = new Collection();
const textCommandFiles = fs.readdirSync('./commands_text').filter(file => file.endsWith('.js'));

for (const file of textCommandFiles) {
	const textCommand = require(`./commands_text/${file}`);
	client.textCommands.set(textCommand.name, textCommand);
}

//Collection of / commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//Collection of buttons actions
client.buttonActions = new Collection();
const buttonActionFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));

for (const file of buttonActionFiles) {
    const buttonAction = require(`./buttons/${file}`);
    client.buttonActions.set(buttonAction.name, buttonAction);
}

//ON READY
client.once('ready', () => {
	console.log(Date() + ' - Ready!'); //Log ready

    //Update presence every 62 seconds
    updatePresence();
    setInterval(function(){
        updatePresence();
    },86400000);
});

//Listen messages
client.on('messageCreate',  async message => {
    try {
        if(message.author.bot) return; //Return if message from bot

        //Write logs
        /*fs.appendFile('/var/www/html/portal.pi/stormys_discord_logs.txt', formatLogInfos(message) + message.content + `\n`, function (err,data) {
            if (err) {
                return console.log(err);
            }
        });*/
        fs.appendFile('msg.txt', formatLogInfos(message) + message.content + `\n`, function (err,data) {
            if (err) {
                return console.log(err);
            }
        });

        let msg = message.content.toLowerCase();//transform every text into lower case and put it into "msg" var
        if(msg == `<@!732424850697748511> help`) msg = `${config.prefix}help`; //allow @me help

        if (!msg.startsWith(config.prefix) || message.author.bot) return;//If not starting with prefix or message from bot -> return
        else console.log(formatLogInfos(message) + msg);
        
        const args = msg.slice(config.prefix.length).trim().split(/ +/);//put the command arguments into an array
        let cmd = args.shift().toLowerCase();
    
        //Alternative commands
        if(cmd==`p` || cmd==`player`){cmd = `players`;}//players
        else if(cmd==`pt` || cmd==`playertime`){cmd = `playerstime`;}//playerstime
        else if(cmd==`cornerbombs` || cmd==`cornerbomber` || cmd==`cb`) cmd = `cornerbomb`; //cornerbomb
        else if(cmd==`griefer` || cmd==`griefing`) cmd = `grief`; //grief
        else if(cmd==`link`) cmd = `links`; //links
        
        if (!client.textCommands.has(cmd)) return;//return if command not recognized
    
        //Execute the command
        try {
            client.textCommands.get(cmd).execute(client, config, message, args);
        } catch (err) {
            console.error(err);
            message.channel.send('There was an error trying to execute that command!');
            return;
        }
    }
    catch (err) {
        console.error(err);
        return;
    }
});

//Use node deploy-commands.js to update commands
client.on('interactionCreate', async interaction => {
    //Command interactions
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            console.log(command);//debug
            await command.execute(interaction, config);
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    //Button interactions
    else if (interaction.isButton()) {
        if(interaction.customId === 'cornerbomb') {
            await client.commands.get('cornerbomb').execute(interaction, config);
        }
        else if(interaction.customId === 'grief') {
            await client.commands.get('grief').execute(interaction, config);
        }
    }
	else return;
});

function formatLogInfos(message)
{
    //Format date
    let dateObj = new Date(message.createdTimestamp);
    let logyear = dateObj.getFullYear();
    let logmonth = ("0"+(dateObj.getMonth()+1)).slice(-2);
    let logday = ("0"+dateObj.getDate()).slice(-2);
    let loghrs = ("0"+dateObj.getHours()).slice(-2);
    let logmin = ("0"+dateObj.getMinutes()).slice(-2);
    let logsec = ("0"+dateObj.getSeconds()).slice(-2);
    
    let logtime = `[${logyear}-${logmonth}-${logday} ${loghrs}:${logmin}:${logsec}]`;
    let loginfos = logtime+`[server:${message.channel.guild.name}][channel:${message.channel.name}][user:${message.author.username}]`;

    return loginfos;
}

//Reload presence function
async function updatePresence()
{
    //Set presence/activity
    client.user.setPresence({
        status: 'online',
        activities: [{
            name: '/help',
            type: 'LISTENING'
        }]
    });
    console.log(Date() + " - " + 'Update presence');
}

//client.login(config.token);
client.login(process.env.token);