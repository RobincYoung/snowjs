# Snowjs
js library for adding snow to a website.

When the library has loaded call ```snowjs.init(characters,delay,fallspeed,colour);```
* 'characters' is a comma seperated string, for snow use: "❄️,❄,❅,❆".
* 'delay' is the time between flakes spawning in ms.
* 'fallspeed' is the speed the flakes move down the screen.
* 'colour' is the colour non-emoji text will be rendered in.
```js
snowchars="❄️,❄,❅,❆";
s=document.createElement('script');
colour="#99ccff";
s.onload = function(){snowjs.init(snowchars,500,30,colour);};
s.async = true;
s.setAttribute('src','/snow.js');
document.head.appendChild(s);
```
