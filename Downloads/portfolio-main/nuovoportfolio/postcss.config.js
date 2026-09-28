// Our own (empty) PostCSS config, so Next does not pick up the one of the
// old site in the parent folder. The only stylesheet is globals.css; Emotion
// handles vendor prefixes for everything else.
module.exports = { plugins: [] };
