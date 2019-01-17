let retryCounter = 3;
function applyTheme(chatTheme, onChatTheme) {
  // for dark theme
  const c_chat_dark = "#0d0d0f";
  const c_on_chat_dark = "#e0e0e2";
  // for light theme
  const c_chat_light = "#ffffff";
  const c_on_chat_light = "#0d0d0f";
  
  // everything else is automatic. No need to touch it.
  // get existing sidebar theme colours
  const theme = TS.prefs.getPref("sidebar_theme_custom_values");
  if (!theme && retryCounter > 0) {
    console.log("[CUSTOM-THEME] sidebar preferences not loaded yet, will try again in a second");
    retryCounter++;
    setTimeout(applyTheme, 1000, chatTheme, onChatTheme);
    return;
  }
  console.log(`[CUSTOM-THEME] sidebar theme: ${theme}`);
  const sidebar_theme = JSON.parse(theme);

  // colors (i.e. background colors)
  const c_primary = sidebar_theme.column_bg;
  const c_primary_hover = sidebar_theme.hover_item;
  const c_secondary = sidebar_theme.active_item;
  const c_highlight = sidebar_theme._badge;

  // on colours (i.e. foreground colors)
  const c_on_primary = sidebar_theme.text_color;
  const c_on_secondary = sidebar_theme.active_item_text;
  const c_on_highlight = sidebar_theme.active_item_text;

  // chat colours
  let c_chat = chatTheme == 'dark' ? c_chat_dark : chatTheme == 'light' ? c_chat_light : c_primary;
  let c_chat_hover = chatTheme == 'light' ? pSBC(0.5, c_primary_hover) : c_primary_hover;
  let c_on_chat = chatTheme == 'dark' ? c_on_chat_dark : chatTheme == 'light' ? c_on_chat_light : c_on_primary;

  // if colours were passed in
  if (chatTheme && (chatTheme.startsWith('#') || chatTheme.startsWith('rgb'))) {
    c_chat = chatTheme;
  }
  if (onChatTheme && (onChatTheme.startsWith('#') || onChatTheme.startsWith('rgb'))) {
    c_on_chat = onChatTheme;
  }
  console.log(`[CUSTOM-THEME] chatTheme: ${chatTheme}, c_chat: ${c_chat}, c_on_chat: ${c_on_chat}`);

  $("<style></style>").appendTo('head').html(`
:root {
    --primary:              ${c_primary};
    --primary-hover:        ${c_primary_hover};
    --secondary:            ${c_secondary};
    --highlight:            ${c_highlight};
    --on-primary:           ${c_on_primary};
    --on-secondary:         ${c_on_secondary};
    --on-highlight:         ${c_on_highlight};
    --primary-dark:         ${pSBC(-0.15, c_primary)};
    --primary-light:        ${pSBC(0.15, c_primary)};
    --secondary-dark:       ${pSBC(-0.15, c_secondary)};
    --secondary-light:      ${pSBC(0.15, c_secondary)};
    --on-primary-strong:    ${pSBC(0.15, c_on_primary)};
    --on-secondary-strong:  ${pSBC(0.15, c_on_secondary)};
    --on-primary-muted:     ${pSBC(-0.25, c_on_primary)};
    --on-secondary-muted:   ${pSBC(-0.25, c_on_secondary)};
    --chat:                 ${c_chat};
    --chat-hover:           ${c_chat_hover};
    --on-chat:              ${c_on_chat};
    --chat-dark:            ${pSBC(-0.15, c_chat)};
    --chat-light:           ${pSBC(0.15, c_chat)};
    --on-chat-strong:       ${pSBC(0.15, c_on_chat)};
    --on-chat-muted:        ${pSBC(-0.25, c_on_chat)};
}
  `);
}

// Shade, Blend and Convert a Web Color (pSBC.js)
// https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
const pSBC = function (p, from, to) {
  if (typeof (p) != "number" || p < -1 || p > 1 || typeof (from) != "string" || (from[0] != 'r' && from[0] != '#') || (to && typeof (to) != "string")) return null; //ErrorCheck
  if (!this.pSBCr) this.pSBCr = (d) => {
    let l = d.length, RGB = {};
    if (l > 9) {
      d = d.split(",");
      if (d.length < 3 || d.length > 4) return null;//ErrorCheck
      RGB[0] = i(d[0].split("(")[1]), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
    } else {
      if (l == 8 || l == 6 || l < 4) return null; //ErrorCheck
      if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 or 4 digit
      d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = -1;
      if (l == 9 || l == 5) RGB[3] = r((RGB[2] / 255) * 10000) / 10000, RGB[2] = RGB[1], RGB[1] = RGB[0], RGB[0] = d >> 24 & 255;
    }
    return RGB;
  }
  var i = parseInt, r = Math.round, h = from.length > 9, h = typeof (to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h, b = p < 0, p = b ? p * -1 : p, to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF", f = this.pSBCr(from), t = this.pSBCr(to);
  if (!f || !t) return null; //ErrorCheck
  if (h) return "rgb" + (f[3] > -1 || t[3] > -1 ? "a(" : "(") + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
  else return "#" + (0x100000000 + r((t[0] - f[0]) * p + f[0]) * 0x1000000 + r((t[1] - f[1]) * p + f[1]) * 0x10000 + r((t[2] - f[2]) * p + f[2]) * 0x100 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255)).toString(16).slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2);
}