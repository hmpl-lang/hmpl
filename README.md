<p align="center">
    <a href="https://www.npmjs.com/package/hmpl-js">
        <img width="200" height="200" src="https://github.com/hmpljs/media/blob/main/logo_transparent.png" alt="hmpl" >
    </a>
</p>
<h1 align="center">hmpl - template language for fetching HTML from API</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/hmpl-js)
[![discussions](https://img.shields.io/badge/discussions-0183ff?style=for-the-badge&logo=github&labelColor=555555)](https://github.com/hmpljs/hmpl/discussions)
[![license](https://img.shields.io/badge/MIT-0183ff?style=for-the-badge&label=license&logoColor=FFF&labelColor=555555)](https://github.com/hmpljs/hmpl/blob/master/LICENSE)

</div>

<div align="center"><a href="https://hmpljs.github.io">Website</a> • <a href="https://hmpljs.github.io/#/docs">Documentation</a> • <a href="https://codesandbox.io/p/sandbox/basic-hmpl-example-dxlgfg">Demo Sandbox</a> • <a href="https://github.com/hmpljs/examples">Examples</a>
</div>
<br/>

## About

🌐 hmpl is a small template language for fetching HTML from API. It is based on requests sent to the server via [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and processed into ready-made HTML. The word hmpl is a combination of the old name cample-html into one word. h-html, mpl-cample.

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
           "src":"http://localhost:8000/api/test" 
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
       "src":"/api/test" 
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

### Why hmpl?

The main goal of this new template language is to simplify working with the server by integrating small request structures into HTML. This can be compared to how, in files with a php extension, you could work with the response from the server received through a php request, but at the same time work with it directly through javascript. Using the example of simply getting the title from a button, you can understand how this template language can simplify your work:

```php
<div>
  <button id="getTitle" onclick="?">Get Title</button>
  <h1><?php echo $title; ?></h1> <!-- if(){?} -->
</div>
```

or

```javascript
import { compile } from "hmpl-js";

const templateFn = compile(
  `<div>
    <button class="getTitle">Get Title!</button>
    <h1>
      { 
        {
          "src":"http://localhost:8000/api/test",
          "after":"click:.getTitle"
        } 
      }
    </h1>
  </div>`
);

const bodyEl = document.querySelector("body");

const elementObj = templateFn();

bodyEl.appendChild(elementObj.response);
```

Thus, despite the fact that this approach does not imply server-side rendering, it does simplify working with HTML and the server and makes it possible to make requests out of the box safely, as well as write less code than would be done through pure javascript.

Also, the main advantage of hmpl is the simplicity and flexibility of working with HTML, which comes with the API. Let's say you can simply make a loop for 1000 iterations and add everything to one DOM node at once, without doing similar code on the server side.

```javascript
import { compile } from "hmpl-js";

const templateFn = compile(
  `<div>
     { 
       {
         "src":"http://localhost:8000/api/test"
       } 
     }
  </div>`
);

const bodyEl = document.querySelector("body");

const elementObj = templateFn({
  get: (prop, value) => {
    if (prop === "response") {
      if (value) {
        for (let i = 0; i < 1000; i++) {
          bodyEl.appendChild(value.cloneNode(true));
        }
      }
    }
  },
});
```

Direct access to the node allows you to interact with the DOM via js without additional `querySelector`.

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

After installation using any convenient method described in [Installation](https://hmpljs.github.io/#/?id=installation), you can start working with the server in the following way:

```html
<script src="https://unpkg.com/hmpl-js/dist/hmpl.min.js"></script>
<script>
  const templateFn = compile(
    `{ 
     {
       "src":"/api/test" 
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
       "src":"/api/test" 
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
      "src":"/api/test"
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

[Changelog](https://github.com/hmpljs/hmpl/releases)

## Inspiration

If you like hmpl, it will be very cool if you rate the repository with a star ★

## Contact

Email - camplejs@gmail.com

## License

[Licensed under MIT](https://github.com/hmpljs/hmpl/blob/master/LICENSE)
