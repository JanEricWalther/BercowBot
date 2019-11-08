// https://discord.js.org/#/docs/main/stable/general/welcome
/* TODO: automatically send Soundfile, when Channel is too loud / to many people
         are speaking at the same time 
*/

const botconfig = require('./botconfig.json');
const Discord = require("discord.js");

const bot = new Discord.Client();
const sounds = './sounds/';

let speakingMember = 0;

// Array of Sound Files to randomly choose from 
const soundFiles = ['ordah.mp3', 'Zen.mp3', 'ordah2.mp3', 'ordah3.mp3', 'ordah4.mp3', 'iKnowWhatImDoing.mp3', 'peopleShouting.mp3', 'theArtOfPatience.mp3', 'FlyingFlamingo.mp3'];

// gets run when bot has joined the discord server 
bot.on('ready', async () => {
  console.log(`${bot.user.username} is online.`);
  bot.user.setActivity('Order in the House of Commons');
});

// ON SPEAKING

bot.on('guildMemberSpeaking', (member, speaking) => {

  if (speaking) {
    console.log(`${member.user.username} started speaking \n`);
  }
  if (!speaking) {
    console.log(`${member.user.username} stopped speaking \n`);
  }
});

// gets run when a message is sent
bot.on('message', async message => {

  // ignore message by the bot, in DMs, aswell as outside of the Server (Guild)
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (!message.guild) return;

  // Command Prefix set in botconfig.json
  let prefix = botconfig.prefix;

  // splitting up the message into command and arguments (text after command)
  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);


  switch (command) {
    case `${prefix}order`:
      sendSoundFile(Math.round(Math.random() * soundFiles.length - 1), message);
      break;

    case `${prefix}ordah`:
      sendSoundFile(Math.round(Math.random() * soundFiles.length - 1), message);
      break;

    case `${prefix}zen`:
      sendSoundFile(1, message);
      break;

    case `${prefix}flamingo`:
      sendSoundFile(8, message);
      break;

    case `${prefix}botinfo`:
      botInfo(message);
      break;

    case `${prefix}commands`:
      commands(message);
      break;

    case `${prefix}join`:
      message.member.voiceChannel.join();
      break;

    case `${prefix}leave`:
      message.member.voiceChannel.leave();
      break;
  }
});

bot.login(botconfig.token);


// COMMANDS
// BOTINFO
function botInfo(message) {

  let botIcon = bot.user.displayAvatarURL; // Avatar Icon
  let botEmbed = new Discord.RichEmbed()
    .setDescription('Bot Information')
    .setColor('#eeeeee')    // stripe on the right
    .setThumbnail(botIcon)
    .addField('Bot Name', bot.user.username)
    .addField('Info', `Use ${botconfig.prefix}commands to get a List of available Commands`);

  return message.channel.send(botEmbed);
}

// COMMANDS
function commands(message) {

  let botEmbed = new Discord.RichEmbed()
    .setDescription('Bot Commands')
    .setColor('#eeeeee')    // stripe on the right
    .addField(`${botconfig.prefix}order / ${botconfig.prefix}ordah`, 'For when you are in need of some Ordah.')
    .addField(`${botconfig.prefix}zen`, 'For when you need some Zen in your life.')
    .addField(`${botconfig.prefix}flamingo`, `For when you don't give a flying Falmingo.`)
    .addField(`${botconfig.prefix}botinfo`, `Bot Info`);

  return message.channel.send(botEmbed);
}

// Sends certain soundfile of the soundArray in the Channel of a user that called the bot 
function sendSoundFile(arrayIndex, message) {
  if (message.member.voiceChannel) {

    // join the Voicechannel of the member who send the command
    message.member.voiceChannel.join()
      .then(connection => {

        console.log(`playing ${soundFiles[arrayIndex]}\n`);
        // set up dispatcher, that plays the soundfile 
        const dispatcher = connection.playFile(sounds.concat(soundFiles[arrayIndex]));

        // leave, after the soundfile has ended
        dispatcher.on('end', () => {
          message.member.voiceChannel.leave();
        })
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel that is in need of some ORDAH!');
  }
}