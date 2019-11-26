// https://discord.js.org/#/docs/main/stable/general/welcome
/* TODO: automatically send Soundfile, when Channel is too loud / to many people
         are speaking at the same time
   TODO: Handle response to command as exception, so there is no longer the need to pass the message into the playSound function
*/

const botconfig = require('./botconfig.json');
const Discord = require("discord.js");

const bot = new Discord.Client();
const sounds = './sounds/';

// Array of Sound Files to randomly choose from 
const soundFiles = ['ordah.mp3', 'ordah5.mp3', 'ordah2.mp3', 'ordah3.mp3', 'ordah4.mp3', 'iKnowWhatImDoing.mp3', 'peopleShouting.mp3', 'theArtOfPatience.mp3'];

let speakingMember = 0;

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

  // ignore message by the bot, in DMs, as well as outside of the Server (Guild)
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
      try {
        sendOrderSound(message.member.voiceChannel);
      } catch (err) {
        await message.reply('Error: ' + err)
      }
      break;

    case `${prefix}ordah`:
      try {
        sendOrderSound(message.member.voiceChannel);
      } catch (err) {
        await message.reply('Error: ' + err)
      }
      break;

    case `${prefix}zen`:
      try {
        sendSoundFile('Zen.mp3', message.member.voiceChannel);
      } catch (err) {
        await message.reply('Error: ' + err);
      }
      break;

    case `${prefix}flamingo`:
      try {
        sendSoundFile('FlyingFlamingo.mp3', message.member.voiceChannel);
      } catch (err) {
        await message.reply('Error: ' + err);
      }
      break;

    case `${prefix}botinfo`:
      botInfo(message);
      break;

    case `${prefix}commands`:
      commands(message);
      break;

    case `${prefix}join`:
      await message.member.voiceChannel.join();
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
    .addField(`${botconfig.prefix}flamingo`, `For when you don't give a flying Flamingo.`)
    .addField(`${botconfig.prefix}botinfo`, `Bot Info`);

  return message.channel.send(botEmbed);
}

// send a random Order Sound File
function sendOrderSound(voiceChannel) {
  let randomArrayIndex = Math.round(Math.random() * soundFiles.length - 1);
  sendSoundFile(soundFiles[randomArrayIndex], voiceChannel);
}

// Sends certain Sound File in the Channel of a user that called the bot
function sendSoundFile(soundPath, voiceChannel) {
  if (!voiceChannel) {
    throw 'You need to join a Voice Channel.';
  }
  else {
    // join the Voice Channel of the member who send the command
    voiceChannel.join()
      .then(connection => {

        console.log(`playing ${soundPath}\n`);
        // set up dispatcher, that plays the Sound File
        const dispatcher = connection.playFile(sounds.concat(soundPath));

        // leave, after the Sound File has ended
        dispatcher.on('end', () => {
          voiceChannel.leave();
        })
      })
      .catch(console.log);
  }
}