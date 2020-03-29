require('dotenv').config();
const Grammarbot = require('grammarbot');
const Discord = require('discord.js');
const logger = require('./src/logger');
const {
  misspelling,
  profanity
} = require('./src/match-handlers');

const BLACKLISTED_CHANNELS = [];

const client = new Discord.Client();
const checker = new Grammarbot({
  'api_key' : process.env.GRAMMAR_BOT_API_KEY,
  'language': 'en-GB'
});
const fetch = require('node-fetch');

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  logger.info({message: `Logged in as ${client.user.tag}!`});
});

client.on('error', error => {
  logger.error('Error Occurred', error);
});

client.on('disconnect', async () => {
  logger.warn('Socket disconnected');
});

client.on('message', async msg => {
  if (allowedInChannel(msg.channel.id)) {
    if (msg.mentions.has(client.user.id)) {
      const foaasRes = await fetch(
        'https://foaas.com/asshole/clippy',
        {
          headers: { 'Accept': 'application/json' }
        }
      );
      try {
        const json = await foaasRes.json();
        msg.reply(json.message);
      } catch(error) {
        logger.error(error);
      }
    } else if (msg.author.id !== client.user.id) {
      const result = await checker.checkAsync(msg.content);

      if (result && result.matches && result.matches.length > 0) {
        msg.react('💔');
        result.matches.forEach(match => {
          logger.info(match);
          const message = handleMatch(match);
          msg.reply(message ? message : match.message);
        });

      } else {
        msg.react('💖');
        msg.reply('congratulations! Your message was found to have no spelling or grammar errors at all. This is good enough to go on the fridge!');
      }
    }
  }
});

function handleMatch(match) {
  if (match.rule.issueType === 'misspelling') {
    return misspelling(match);
  } else if (match.rule.id === 'PROFANITY') {
    return profanity(match);
  }

  return match.message;
}

function allowedInChannel(channelID) {
  return !BLACKLISTED_CHANNELS.includes(channelID);
}
