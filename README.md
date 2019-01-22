# slack-dark-redux
Yet another dark theme for Slack.

# Applying the theme
## Using Stylus for Slack on the web

> **Note:** A previous version of this guide recommending installing *Stylish*,
but due to privacy concerns, *Stylus* is now recommended.

If you haven't installed Stylus in your browser, you can do so by following the
links here: https://add0n.com/stylus.html

Create a new style in Stylus and copy-paste the css from this repository.

At the bottom of the page, specify the css to apply to URLs on the domain
`slack.com`.

Give it a name, save it, then reload your slack tab.

## Installing into Slack Desktop

Find your Slack's application directory.

* Windows: `%localappdata%\slack\`
* Mac: `/Applications/Slack.app/Contents/`
* Linux: `/usr/lib/slack/` (Debian-based)


Open up the most recent version (e.g. `app-2.5.1`) then open
`resources\app.asar.unpacked\src\static\ssb-interop.js`

At the very bottom, add

```js
function onThemeLoaded() {
  if (themeCssLoaded === true && themeJsLoaded === true) {
    // chat theme. Options are applyTheme('light') and applyTheme('dark'), anything else attempts to use sidebar colors
    // alternately, you can pass in two css colors to specify the chat background and foreground, respectively
    applyTheme();
  }
}

// load up the required css and js
const cssUrl = 'https://raw.githubusercontent.com/deathau/slack-dark-redux/master/style.css';
const jsUrl = 'https://raw.githubusercontent.com/deathau/slack-dark-redux/master/inject.js';
let themeJsLoaded = false;
let themeCssLoaded = false;
document.addEventListener('DOMContentLoaded', function () {
  $.ajax({ url: cssUrl, success: function (css) {
      $("<style></style>").appendTo('head').html(css); // append the css
      console.log(`[CUSTOM-THEME] Loaded CSS successfully`);
      themeCssLoaded = true; onThemeLoaded();
    }});
  $.ajax({ url: jsUrl, success: function (rawData) {
      require('vm').runInThisContext(rawData, jsUrl); // load up the javascript
      console.log(`[CUSTOM-THEME] Loaded JavaScript successfully`);
      themeJsLoaded = true; onThemeLoaded();
    }});
});
```

That's it! Restart Slack and see how well it works.

NB: You'll have to do this every time Slack updates.

# Philosophy

I found a dark theme I kinda liked on userstyles.org and modified it to my
liking. Then I kept noticing things that had to be fixed or changed and I
started to realize how little I could follow the css in that theme and how big
and bloated I was making it, so I decided to start my own dark theme from
scratch.

I also decided to use LESS so I can tweak colours to my liking without having to
change it in multiple places (I later discovered CSS has built-in support for
variables, but I'm still using LESS for colour transforms and logical
seperation). I'm using the Easy LESS plugin for Visual Studio Code which
compiles the LESS into css on every save, so the CSS should match to the LESS
file every commit.

I'm a fan of structure, which is not easy given the convoluted mess required to
style all the elements of Slack, so I've decided to try and add some more
structure to the repo by splitting concerns across different less files, with
the main `style.less` pulling them all together.

I also want to make a structured and easily modifyable colour theme, preferably
in a way that can make it easily tie in with your sidebar theme. I'm still
working on that...