function getMistake(context) {
  const { text, offset, length } = context;

  return text.slice(offset, offset + length);
}

module.exports = getMistake;
