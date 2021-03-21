const discord = require("discord.js");
require('dotenv').config();
const client = new discord.Client();
const ytdl = require('ytdl-core');

const TOKEN = process.env.CLIENT_TOKEN
      CHANNEL = process.env.CHANNEL_ID
      STATUS = "Green Hill Zone"
      URL = "https://www.youtube.com/watch?v=G-i8HYi1QH0";

client.on('ready', async () => {
  //SET STATUS AND CHECK CHANNEL EXISTS
  client.user.setActivity(STATUS,{type: 'LISTENING'})
  const channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)
  if(!channel) return;

  function plays (connection) {
    console.log('Play');
    const dispatcher = connection.play(ytdl(URL));
    dispatcher.on('finish', () => {
      //ONCE FINISHED, START AGAIN!
      plays(connection);
    });
  };

//JOIN CHANNEL AND START PLAYING
  await channel.join().then(connection => {
    plays(connection);
  })

  client.on('message', async message => {
    if (!message.guild) return;
    if (message.content === '!restartghb') {
      let botChannel = message.guild.voice.connection.channel;
      console.log('Stopping')
      botChannel.leave();
      setTimeout(function(){
        console.log('Restarting')
        botChannel.join().then(connection => {
          plays(connection);
        });
      }, 2000);
    }
  });

});

client.login(TOKEN) //TEST