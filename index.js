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

//SET UP PLAY FUNCTION
  function plays (connection) {
    let botChannel = connection.channel;
    
    const dispatcher = connection.play(ytdl(URL));
    //IF CHANNEL IS EMPTY, PAUSE
    if (botChannel.members.size <= 1) {
      dispatcher.pause();
    };

    client.on('voiceStateUpdate', () => {
      //WHEN USER JOINS/LEAVES, CHECK CHANNEL SIZE
      if(botChannel.members.size <= 1) {
        //IF CHANNEL IS EMPTY, PAUSE
        dispatcher.pause();
      } else {
        //ELSE RESUME
        dispatcher.resume();
      }
    });

    dispatcher.on('finish', () => {
      //ONCE FINISHED, START AGAIN!
      plays(connection);
    });
  };

//JOIN CHANNEL AND START PLAYING
  await channel.join().then(connection => {
    plays(connection);
  })

//EMERGENCY RESTART COMMAND
  client.on('message', async message => {
    if (!message.guild) return;
    if (message.content === '!restartghb') {
      //CHECK FOR RESTART MESSAGE
      console.log('Stopping')
      //LEAVE THE CHANNEL
      channel.leave();
      setTimeout(function(){
        console.log('Restarting')
        //WAIT 2 SECONDS AND REJOIN CHANNEL
        channel.join().then(connection => {
          plays(connection);
        });
      }, 2000);
    }
  });

});

client.login(TOKEN)