const { TOKEN, CHANNEL, SERVER, STATUS, LIVE } = require("./config.json");
const discord = require("discord.js");
const client = new discord.Client();
const ytdl = require('ytdl-core');

client.on('ready', async () => {
  //SET STATUS AND CHECK CHANNEL EXISTS
  client.user.setActivity(STATUS,{type: 'LISTENING'})
  const channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)
  if(!channel) return;

  //JOIN CHANNEL AND START PLAYING
  const connection = await channel.join();
  const dispatcher = connection.play(ytdl(LIVE));
  //PAUSE IF CHANNEL IS EMPTY (BESIDES BOT)
  if(channel.members.size === 1) {
    dispatcher.pause();
    console.log('User Not Present. Pausing');
  }

  //AS USERS JOIN/LEAVE, CHECK CURRENT MEMBERS. PAUSE IF EMPTY
  client.on('voiceStateUpdate', async () => {
  if(channel.members.size > 1) {
    dispatcher.resume();
    console.log('User Present. Resuming');
  } else {
    dispatcher.pause();
    console.log('User Not Present. Pausing');
  }
});

//ONCE FINISHED, PLAY AGAIN!
dispatcher.on('finish', () => {
  const dispatcher = connection.play(ytdl(LIVE));
  if(channel.members.size === 1) {
    dispatcher.pause();
    console.log('User Not Present. Pausing');
  }
});
})

client.login(TOKEN) //TEST