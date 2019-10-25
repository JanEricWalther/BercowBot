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
const soundFiles = ['ordah.mp3', 'Zen.mp3','ordah2.mp3','ordah3.mp3','ordah4.mp3','iKnowWhatImDoing.mp3','peopleShouting.mp3','theArtOfPatience.mp3','FlyingFlamingo.mp3'];

// gets run when bot has joined the discord server 
bot.on('ready', async() => {
  console.log(`${bot.user.username} is online.`);
  bot.user.setActivity('Order in the House of Commons');
});

  
bot.on('guildMemberSpeaking', (member, speaking) => {
          
  if(speaking) {
    console.log(`${member.user.username} started speaking`);
  }
  if(!speaking){
    console.log(`${member.user.username} started speaking`);
  }
});

// gets run when a message is sent
bot.on('message', async message => {

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


  // JOIN CHANNEL
  if(command === `${prefix}join`) {

    if(message.member.voiceChannel) {
      message.member.voiceChannel.join();
    }
  }

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
    message.reply('You need to join a voice channel that is in need for some ORDAH!');
  }
}