const {
  getMistake
} = require('../utils');

function profanity(match) {
  const mistake = getMistake(match.context);
  let message = `The word "${mistake}" is considered offensive and not suitable for this server.\n`;

  message += `\tPlease see ${match.rule.urls[0].value} for more information.`;

  return message;
}

module.exports = profanity;
