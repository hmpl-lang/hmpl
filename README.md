<p align="center">
    <a href="https://www.npmjs.com/package/hmpl-js">
        <img width="200" height="200" src="https://github.com/hmpl-lang/media/blob/main/logo_transparent.png" alt="hmpl" >
    </a>
</p>
<h1 align="center">hmpl - template language for displaying UI from server to client</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/hmpl-js)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://bundlephobia.com/package/hmpl-js) 
[![issues](https://img.shields.io/github/issues/hmpl-lang/hmpl?logo=github&color=0183ff&style=for-the-badge)](https://github.com/hmpl-lang/hmpl/issues) 
[![downloads](https://img.shields.io/npm/dm/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/hmpl-js)

</div>

<div align="center"><a href="https://hmpl-lang.github.io">Website</a> • <a href="https://hmpl-lang.github.io/introduction.html">Documentation</a> • <a href="https://codesandbox.io/p/sandbox/basic-hmpl-example-dxlgfg">Demo Sandbox</a> • <a href="https://hmpl-lang.github.io/examples.html">Examples</a>
</div>
<br/>

## In short, about

Best alternative to htmx and alpine.js

## About

🌐 hmpl is a small template language for displaying UI from server to client. It is based on requests sent to the server via [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and processed into ready-made HTML. Reduce the size of your javascript files and display the same UI as if it was written in a modern framework.

## Example #1

### HTML before

```html
<div id="wrapper"></div>
<script src="https://unpkg.com/hmpl-js/dist/hmpl.min.js"></script>
<script>
  const templateFn = hmpl.compile(
    `<div>
       { 
         {
           "src": "http://localhost:8000/api/test" 
         } 
       }
    </div>`
  );

  const wrapper = document.getElementById("wrapper");

  const obj = templateFn();

  /**
   * obj = {
   *  response: div,
   *  status: 200
   * }
   */

  wrapper.appendChild(obj.response);
</script>
```

### API route - /api/test

```html
<span>123</span>
```

### HTML after

```html
<div id="wrapper">
  <div><span>123</span></div>
</div>
```

## Example #2

```typescript
import { compile } from "hmpl-js";

const templateFn = compile(
  `{ 
     {
       "src": "/api/test",
       "indicators": [
           {
             "trigger": "pending",
             "content": "<div>Loading...</div>"
           },
           {
             "trigger": "rejected",
             "content": "<div>Error</div>"
           }
       ] 
     } 
   }`
);

const wrapper = document.getElementById("wrapper");

const elementObj = templateFn({
  credentials: "same-origin",
  get: (prop, value) => {
    if (prop === "response") {
      if (value) {
        wrapper.appendChild(value.content);
      }
    }
  },
});
```

## Why hmpl?

The HMPL template language extends the capabilities of regular HTML by adding query objects to the markup to reduce the code on the client. When creating modern web applications, frameworks and libraries are used, which entail the need to write a bunch of boilerplate code, as well as connecting additional modules, which again make JavaScript files very large. If you recall the same SPA, then there js files can reach several hundred megabytes, which makes the first site load speed quite long. All this can be avoided by generating the markup on the server and then loading it on the client. Example of comparing the file size of a web application on Vue and HMPL.js:

```javascript
createApp({
  setup() {
    const count = ref(0);
    return {
      count,
    };
  },
  template: `<div>
        <button @click="count++">Click!</button>
        <div>Clicks: {{ count }}</div>
    </div>`,
}).mount("#app");
```
> Size: **226** bytes (4KB on disk)

```javascript
document.querySelector("#app").append(
  hmpl.compile(
    `<div>
        <button>Click!</button>
        <div>Clicks: {{ "src": "/api/clicks", "after": "click:button" }}</div>
    </div>`
  )().response
);
```
> Size: **206** bytes (4KB on disk)

If we do not take into account that in one case we store the state on the client, and in the other on the server, as well as the response speed from the server, then we can see that with different file sizes we get the same interface. And this is only a small example. If we take large web applications, then the file sizes there can be several times smaller.

## Installation

hmpl can be installed in several ways, which are described in this article. This tool is a simple javascript file that is connected in the usual way through a `script`, or using the `import` construct in an environment that supports this (webpack build, parcel build etc.). The first and easiest way is to install using a CDN.

### Package Manager

This method involves downloading through npm or other package managers.

```bash
npm i hmpl-js
```

> [Node.js](https://nodejs.org) is required for npm.

Along the path node-modules/hmpl/dist you can find two files that contain a regular js file and a minified one.

### Manual download

You can install the package by simply [downloading](https://unpkg.com/hmpl-js/dist/hmpl.min.js) it as a file and moving it to the project folder.

```html
<script src="./hmpl.min.js"></script>
```

If, for some reason, you do not need the minified file, then you can download the full file from this [link](https://unpkg.com/hmpl-js/dist/hmpl.js).

```html
<script src="./hmpl.js"></script>
```

The non-minified file is larger in size, but it is there as it is with all the formatting.

### CDN

This method involves connecting the file through a third-party resource, which provides the ability to obtain a javascript file from npm via a link.

```html
<script src="https://unpkg.com/hmpl-js/dist/hmpl.min.js"></script>
<!--
  integrity="sha384-..."
  crossorigin="anonymous"
-->
```

This resource could be unpkg, skypack or other resources. The examples include unpkg simply because it is one of the most popular and its url by characters is not so long.

## Getting started

After installation using any convenient method described in [Installation](https://hmpl-lang.github.io/installation.html), you can start working with the server in the following way:

```html
<script src="https://unpkg.com/hmpl-js/dist/hmpl.min.js"></script>
<script>
  const templateFn = compile(
    `{ 
       {
         "src": "/api/test" 
       } 
     }`
  );
  const elementObj = templateFn();
</script>
```

Or, if you need to work with hmpl as a module, there is a list of imported functions, such as `compile`:

```typescript
import { compile } from "hmpl-js";
const templateFn = compile(
  `{ 
     {
       "src": "/api/test" 
     } 
   }`
);
const elementObj = templateFn();
```

These will be the two main ways to interact with the server. In future versions, the functionality will be expanded, but the methods themselves will not change.

## Webpack

Module has its own loader for files with the `.hmpl` extension. You can include [hmpl-loader](https://www.npmjs.com/package/hmpl-loader) and use the template language syntax in separate files:

### main.hmpl

```hmpl
<div>
  {
    {
      "src": "/api/test"
    }
  }
</div>
```

### main.js

```javascript
const templateFn = require("./main.hmpl");

const elementObj = templateFn();
```

For the loader to work, it is better to use versions `0.0.2` or higher.

## Changelog

[Changelog](https://hmpl-lang.github.io/changelog.html)

## Inspiration

If you like hmpl, it will be very cool if you rate the repository with a star ★

## Contact

Email - camplejs@gmail.com

## License

[Licensed under MIT](https://github.com/hmpl-lang/hmpl/blob/master/LICENSE)
