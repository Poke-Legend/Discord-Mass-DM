const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

const token = 'Discord Bot Token';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Mass Direct Messages Created by DeVry`);
});

client.on('messageCreate', async message => {
    if (!message.guild) return; // Ignore DMs
    if (message.author.bot) return; // Ignore bot's own messages
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return; // Only allow admins to use the command

    if (message.content.startsWith('!massdm ')) {
        const dmMessage = message.content.slice(8).trim(); // Extract the message to send

        if (dmMessage.length === 0) {
            message.channel.send("Please include a message to send.");
            return;
        }

        const embed = new MessageEmbed()
            .setTitle('Important Announcement')
            .setDescription(dmMessage)
            .setColor('BLUE');

        client.guilds.cache.forEach(async guild => {
            const members = await guild.members.fetch();
            members.forEach(member => {
                if (!member.user.bot) {  // Don't send messages to bots
                    member.send({ embeds: [embed] })
                        .then(() => console.log(`Embed sent to ${member.user.tag}`))
                        .catch(error => console.error(`Could not send embed to ${member.user.tag}: ${error}`));
                }
            });
        });
        message.channel.send("Embeds are being sent to all members across all guilds.");
    }
});

client.login(token);

