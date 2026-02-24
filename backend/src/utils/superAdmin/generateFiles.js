const generateFileName = (originalName) => {
  return Date.now() + "-" + originalName.replace(/\s+/g, "");
};

module.exports = generateFileName;