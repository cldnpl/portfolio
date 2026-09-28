# Fonts

The design uses two Pangram Pangram families. They are commercial fonts, so the
files are not in this repo: download them from https://pangrampangram.com
(free for personal use; a licence is needed for commercial use) and drop the
`.otf` files here with exactly these names:

PP Neue Montreal
- PPNeueMontreal-Thin.otf        (declared as weight 200, like the reference)
- PPNeueMontreal-Book.otf        (400)
- PPNeueMontreal-Italic.otf      (400 italic)
- PPNeueMontreal-Medium.otf      (500)
- PPNeueMontreal-SemiBolditalic.otf (600 italic)
- PPNeueMontreal-Bold.otf        (700)

Humane
- Humane-Thin.otf, Humane-ExtraLight.otf, Humane-Light.otf, Humane-Regular.otf,
  Humane-Medium.otf, Humane-SemiBold.otf, Humane-Bold.otf

Do not add PP Neue Montreal Light: the reference has no 300 weight, so
`fontWeight="light"` falls back to Thin. Adding it would change every light text.

Until the files are here the site falls back to Hanken Grotesk and Six Caps.
