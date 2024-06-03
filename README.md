<p align="center">
    <a href="https://www.npmjs.com/package/hmpl-js">
        <img width="200" height="200" src="https://github.com/hmpljs/media/blob/main/logo_transparent.png" alt="hmpl" >
    </a>
</p>
<h1 align="center">hmpl - template language for working with server-side HTML</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/hmpl-js?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/hmpl-js)
[![discussions](https://img.shields.io/badge/discussions-0183ff?style=for-the-badge&logo=github&labelColor=555555)](https://github.com/hmpljs/hmpl/discussions)
[![license](https://img.shields.io/badge/MIT-0183ff?style=for-the-badge&label=license&logoColor=FFF&labelColor=555555)](https://github.com/hmpljs/hmpl/blob/master/LICENSE)

</div>

<div align="center"><a href="https://hmpljs.github.io">Website</a> • <a href="https://hmpljs.github.io/#/?id=request">Documentation</a>
</div>
<br/>

## About

🌐 hmpl is a small template language for working with server-side HTML. It is based on requests sent to the server via `fetch` and processed into ready-made HTML. The word hmpl is a combination of the old name cample-html into one word. h-html, mpl-cample.

## Example #1

### HTML before

```html
<div id="wrapper"></div>
<script src="https://unpkg.com/hmpl-js@1.0.3/dist/hmpl.min.js"></script>
<script>
const templateFn = hmpl.compile(
  `<request src="/api/test"></request>`
);

const wrapper = document.getElementById("wrapper");

const elementObj = templateFn({
  credentials: "same-origin",
  get: (prop, value) => {
    if (prop === "response") {
      if (value) {
        wrapper.appendChild(value.content.firstElementChild);
      }
    }
  },
});
</script>
```

### Server route - /api/test

```html
<div>123</div>
```

### HTML after

```html
<div id="wrapper">
  <div>123</div>
</div>
```

## Example #2

```typescript
import { compile } from "hmpl-js";

const templateFn = compile(
  `<div>
    <button class="getHTML">Get HTML!</button>
    <request src="/api/test" after="click:.getHTML"></template>
  </div>`
);

const wrapper = document.getElementById("wrapper");

const elementObj = templateFn({
  get: (prop, value) => {
    if (prop === "response") {
      if (value) {
        wrapper.appendChild(value);
      }
    }
  },
});
```

### Why hmpl?

hmpl is easy to use and effective in practice. You can literally download reusable HTML from the server in just a couple of clicks, which will reduce a huge amount of code and also simplify the creation of the user interface. Also, this product is open-source under the [MIT license](https://github.com/hmpljs/hmpl/blob/master/LICENSE), which allows it to be used for commercial purposes.

Here are a few small advantages that the module has:

- Light weight
- Ability to work with template mounting directly via js
- Request Status Update
- Fairly safe HTML processing without outerHTML and similar functions, which minimizes the likelihood of errors
- Fully documented

And other advantages that will be visible when working with the module.

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

You can install the package by simply [downloading](https://unpkg.com/hmpl-js@1.0.3/dist/hmpl.min.js) it as a file and moving it to the project folder.

```html
<script src="./hmpl.min.js"></script>
```

If, for some reason, you do not need the minified file, then you can download the full file from this [link](https://unpkg.com/hmpl-js@1.0.3/dist/hmpl.js).

```html
<script src="./hmpl.js"></script>
```

The non-minified file is larger in size, but it is there as it is with all the formatting.

### CDN

This method involves connecting the file through a third-party resource, which provides the ability to obtain a javascript file from npm via a link.

```html
<script
  src="https://unpkg.com/hmpl-js@1.0.3/dist/hmpl.min.js"
></script>
<!--
  integrity="sha384-..."
  crossorigin="anonymous"
-->
```

This resource could be unpkg, skypack or other resources. The examples include unpkg simply because it is one of the most popular and its url by characters is not so long.

## Getting started

After installation using any convenient method described in [Installation](https://hmpljs.github.io/#/?id=installation), you can start working with the server in the following way:

```html
<script src="https://unpkg.com/hmpl-js@1.0.3/dist/hmpl.min.js"></script>
<script>
const templateFn = hmpl.compile(
  `<request src="/api/test"></template>`
);
const elementObj = templateFn();
</script>
```

Or, if you need to work with hmpl as a module, there is a list of imported functions, such as `compile`:

```typescript
import { compile } from "hmpl-js";
const templateFn = hmpl.compile(
  `<request src="/api/test"></template>`
);
const elementObj = templateFn();
```

These will be the two main ways to interact with the server. In future versions, the functionality will be expanded, but the methods themselves will not change.

## Changelog

[Changelog](https://github.com/hmpljs/hmpl/releases)

## Inspiration

If you like hmpl, it will be very cool if you rate the repository with a star ★

## Contact

Email - camplejs@gmail.com

## License

[Licensed under MIT](https://github.com/hmpljs/hmpl/blob/master/LICENSE)
