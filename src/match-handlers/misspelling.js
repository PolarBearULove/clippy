const {
  bold,
  strikethrough
} = require('../textFormatting');

function misspelling(match) {
  // Initialise message with heading
  let message = heading();
  message += quotedMistake(match);
  message += suggestionHeading();
  message += suggestions(match);

  return message;
}

function heading() {
  return `\n${bold('Possible spelling mistake:')}\n`;
}

function quotedMistake(match) {
  const {text, offset, length} = match.context;
  // Get mistake from text section
  const mistake = text.slice(offset, offset + length);
  const highlightedMistake = strikethrough(mistake);

  return `> ${text.replace(mistake, highlightedMistake)}`;
}

function suggestionHeading() {
  return `\n${bold('Suggestions:')}\n`;
}

function suggestions(match) {
  let message = '';
  match.replacements.forEach((replacement, idx) => {
    message += `\t${idx + 1}. ${replacement.value}\n`;
  });

  return message;
}

module.exports = misspelling;
