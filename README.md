# snowjs
js library for adding snow to a website

```js
snowchars="❄️,❄,❅,❆";
s=document.createElement('script');
s.onload = function(){snowjs.init(snowchars);};
s.async = true;
s.setAttribute('src','/snow.js');
document.head.appendChild(s);
```
