// https://discord.js.org/#/docs/main/stable/general/welcome

const botconfig = require('./botconfig.json');
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});
const sounds = './sounds/';
// Array of Sound Files to randomly choose from 
const soundFiles = ['ordah.mp3', 'Zen.mp3','ordah2.mp3','ordah3.mp3','ordah4.mp3','iKnowWhatImDoing.mp3','peopleShouting.mp3','theArtOfPatience.mp3','FlyingFlamingo.mp3'];

// gets run when bot has joined the discord server 
bot.on("ready", async() => {
  console.log(`${bot.user.username} is online.`);
  bot.user.setActivity('Order in the House of Commons');
});

// TODO: automatically send Soundfile, when Channel is too loud / to many people are speaking at the same time 

// gets run when a message is sent
bot.on("message", async message => {
  // ignore message by the bot, in DMs, aswell as outside of the Server (Guild)
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  if (!message.guild) return;

  // Command Prefix set in botconfig.json
  let prefix = botconfig.prefix;
  // splitting up the message into command and arguments (text after command)
  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  // BOTINFO
  if(command === `${prefix}botinfo`){
    let botIcon = bot.user.displayAvatarURL; // Avatar Icon
    let botEmbed = new Discord.RichEmbed()
    .setDescription('Bot Information')
    .setColor('#eeeeee')    // stripe on the right
    .setThumbnail(botIcon)
    .addField('Bot Name', bot.user.username);

    return message.channel.send(botEmbed);
  }

  // ORDER
  // select random Sundfile from the Soundfile Array
  if(command === `${prefix}order` || command === `${prefix}ordah`) sendSoundFile(Math.round(Math.random()*soundFiles.length-1), message);

  // special command to zen the Zen Soundfile
  if(command === `${prefix}zen`) sendSoundFile(1, message);
  // special command to zen the Zen Soundfile
  if(command === `${prefix}flamingo`) sendSoundFile(8, message);
});

bot.login(botconfig.token);

function sendSoundFile(arrayIndex, message) {
  if (message.member.voiceChannel) {
    // join the Voicechannel of the member who send the command
    message.member.voiceChannel.join()
      .then(connection => {
        console.log(`playing ${soundFiles[arrayIndex]}\n`);
        // set up dispatcher, that plays the soundfile 
        const dispatcher = connection.playFile(sounds.concat(soundFiles[arrayIndex]));
        // Playback Volume setter
        dispatcher.setVolume(1);

        // leave, after the soundfile has ended
        dispatcher.on('end', () => {
          message.member.voiceChannel.leave();
        })
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel to put to order first!');
  }
}