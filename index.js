require('dotenv').config();
const Grammarbot = require('grammarbot');
const Discord = require('discord.js');
const client = new Discord.Client();
const checker = new Grammarbot({
  'api_key' : process.env.GRAMMAR_BOT_API_KEY,
  'language': 'en-GB'
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.author.id !== client.user.id) {
    const result = await checker.checkAsync(msg.content);

    if (result && result.matches && result.matches.length > 0) {

      result.matches.forEach(match => {
        console.log(match);
        msg.reply(match.message);
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
