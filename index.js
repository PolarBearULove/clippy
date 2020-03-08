require('dotenv').config();
const Grammarbot = require('grammarbot');
const Discord = require('discord.js');
const {
  misspelling
} = require('./src/match-handlers');


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
      msg.react('💔');
      result.matches.forEach(match => {
        console.log(match);
        const message = handleMatch(match);
        msg.reply(message ? message : match.message);
      });

    } else {
      msg.react('💖');
      msg.reply('congratulations! Your message was found to have no spelling or grammar errors at all. This is good enough to go on the fridge!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

function handleMatch(match) {
  if (match.rule.issueType === 'misspelling') {
    return misspelling(match);
  }

  return match.message;
}
