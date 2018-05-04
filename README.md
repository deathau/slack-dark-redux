# slack-dark-redux
Yet another dark theme for Slack.

I found a dark theme I kinda liked on userstyles.org and modified it to my liking. Then I kept noticing things that had to be fixed or changed and I started to realize how little I could follow the css in that theme and how big and bloated I was making it, so I decided to start my own dark theme from scratch.

I also decided to use LESS so I can tweak colours to my liking without having to change it in multiple places. I'm using the Easy LESS plugin for Visual Studio Code which compiles the LESS into css on every save, so the CSS should match to the LESS file every commit.

# Applying the theme
## Using Stylish for Slack on the web

If you haven't installed Stylish in your browser, you can do so by following the links here: https://userstyles.org/

Create a new style in Stylish and copy-paste the css from this repository.

At the bottom of the page, specify the css to apply to URLs on the domain `slack.com`.

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
document.addEventListener('DOMContentLoaded', function() {
  $.ajax({
    url: 'https://raw.githubusercontent.com/deathau/slack-dark-redux/master/style.css',
    success: function(css) {
      $("<style></style>").appendTo('head').html(css);
    }
  });
});
```

That's it! Restart Slack and see how well it works.

NB: You'll have to do this every time Slack updates.