(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    //@ts-expect-error define not found
  } else if (typeof define === "function" && define.amd) {
    //@ts-expect-error define not found
    define([], factory);
  } else {
    //@ts-expect-error root.hmpl not found
    root.hmpl = root.hmpl || factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return (function () {
    "use strict";
    const checkObject = (val) => {
      return typeof val === "object" && !Array.isArray(val) && val !== null;
    };
    const checkFunction = (val) => {
      return Object.prototype.toString.call(val) === "[object Function]";
    };
    const createError = (text) => {
      throw new Error(text);
    };
    const getIsMethodValid = (method) => {
      return (
        method !== "get" &&
        method !== "post" &&
        method !== "put" &&
        method !== "delete" &&
        method !== "patch"
      );
    };
    const NODE_ATTR = "TEMPLATE";
    const DATA_STATIC = "data-";
    const HMPL_ATTRIBUTE = `${DATA_STATIC}hmpl`;
    const SOURCE_ATTR = `${DATA_STATIC}src`;
    const METHOD_ATTR = `${DATA_STATIC}method`;
    const STATUS_ATTR = `${DATA_STATIC}status`;
    const AFTER_ATTR = `${DATA_STATIC}after`;
    const MODE_ATTR = `${DATA_STATIC}mode`;

    const doc = () => document;
    const getResponseElements = (response) => {
      if (typeof response !== "string") createError("Bad response");
      const elementDocument = new DOMParser().parseFromString(
        `<template>${response}</template>`,
        "text/html"
      );
      const elWrapper = elementDocument.childNodes[0].childNodes[0].firstChild;
      const elContent = elWrapper.content;
      const scripts = elContent.querySelectorAll("script");
      for (let i = 0; i < scripts.length; i++) {
        const currentScript = scripts[i];
        elContent.removeChild(currentScript);
      }
      return elWrapper;
    };
    const makeRequest = (
      el,
      dataObj,
      method,
      source,
      options,
      templateObject
    ) => {
      const {
        mode,
        cache,
        redirect,
        get,
        referrerPolicy,
        credentials,
        timeout,
        headers,
        requestBody
      } = options;
      const initRequest = {
        method: method.toUpperCase()
      };
      if (credentials !== undefined) {
        initRequest.credentials = credentials;
      }
      if (requestBody !== undefined) {
        initRequest.body = requestBody;
      }
      if (mode !== undefined) {
        initRequest.mode = mode;
      }
      if (cache !== undefined) {
        initRequest.cache = cache;
      }
      if (redirect !== undefined) {
        initRequest.redirect = redirect;
      }
      if (referrerPolicy !== undefined) {
        initRequest.referrerPolicy = referrerPolicy;
      }
      if (headers) {
        if (checkObject(headers)) {
          const newHeaders = new Headers();
          for (const header in headers) {
            const [key, value] = header;
            if (typeof value === "string") {
              try {
                newHeaders.set(key, value);
              } catch (e) {
                throw e;
              }
            } else {
              createError(`Header has no string value`);
            }
          }
          initRequest.headers = newHeaders;
        } else {
          createError(`The "header" property does not have a value object`);
        }
      }
      if (timeout) {
        initRequest.signal = AbortSignal.timeout(timeout);
      }
      const isTemplateObject = templateObject !== undefined;
      const updateStatus = (status) => {
        if (templateObject.status !== status) {
          templateObject.status = status;
          get?.("status", status);
        }
      };
      const updateElStatus = (status) => {
        if (status) {
          el.setAttribute(STATUS_ATTR, status);
        } else {
          el.removeAttribute(STATUS_ATTR);
        }
      };
      if (isTemplateObject) {
        updateStatus(0);
      } else {
        updateElStatus("loading");
      }
      fetch(source, initRequest)
        .then((response) => {
          if (isTemplateObject) {
            updateStatus(response.status);
          } else {
            updateElStatus();
          }
          if (!response.ok) {
            createError(`Request error with code ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          const templateWrapper = getResponseElements(data);
          if (isTemplateObject) {
            templateObject.element = templateWrapper;
            get?.("element", templateWrapper);
          } else {
            const nodes = templateWrapper.content.childNodes;
            if (dataObj) {
              if (dataObj.nodes) {
                const newNodes = [];
                const nodesLength = dataObj.nodes.length;
                for (let i = 0; i < nodesLength; i++) {
                  const node = dataObj.nodes[i];
                  if (i === nodesLength - 1) {
                    for (let j = 0; j < nodes.length; j++) {
                      const reqNode = nodes[j];
                      const newNode = dataObj.parentNode.insertBefore(
                        reqNode,
                        node
                      );
                      newNodes.push(newNode);
                    }
                  }
                  dataObj.parentNode.removeChild(node);
                }
                dataObj.nodes = newNodes;
              } else {
                const parentNode = el.parentNode;
                const newNodes = [];
                for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  const newNode = parentNode.insertBefore(node, el);
                  newNodes.push(newNode);
                }
                parentNode.removeChild(el);
                dataObj.nodes = newNodes;
                dataObj.parentNode = parentNode;
              }
            } else {
              const parentNode = el.parentNode;
              for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                parentNode.insertBefore(node, el);
              }
              parentNode.removeChild(el);
            }
          }
        })
        .catch((error) => {
          throw error;
        });
    };
    const renderTemplate = (el, fn, isFunction) => {
      const source = el.getAttribute(SOURCE_ATTR);
      if (source) {
        const method = (el.getAttribute(METHOD_ATTR) || "GET").toLowerCase();
        if (getIsMethodValid(method)) {
          createError(
            `${METHOD_ATTR} has only GET, POST, PUT, PATCH or DELETE values`
          );
        } else {
          const after = el.getAttribute(AFTER_ATTR);
          let oldMode = el.getAttribute(MODE_ATTR);
          let modeAttr = (oldMode || "all").toLowerCase();
          if (modeAttr !== "one" && modeAttr !== "all")
            createError(`${MODE_ATTR} has only ONE or ALL values`);
          const isAll = modeAttr === "all";
          let dataObj;
          if (isAll && after) {
            dataObj = {
              nodes: null,
              parentNode: null
            };
          }
          const reqFunction = isFunction
            ? (options, templateObject) =>
                makeRequest(
                  undefined,
                  undefined,
                  method,
                  source,
                  options,
                  templateObject
                )
            : () => {
                makeRequest(el, dataObj, method, source, {});
              };
          let requestFunction = reqFunction;
          if (after) {
            const setEvents = (event, selector, options, templateObject) => {
              const els = doc().querySelectorAll(selector);
              const afterFn = isAll
                ? () => {
                    reqFunction(options, templateObject);
                  }
                : () => {
                    reqFunction(options, templateObject);
                    for (let j = 0; j < els.length; j++) {
                      const currentAfterEl = els[j];
                      currentAfterEl.removeEventListener(event, afterFn);
                    }
                  };
              for (let i = 0; i < els.length; i++) {
                const afterEl = els[i];
                afterEl.addEventListener(event, afterFn);
              }
            };
            if (after.indexOf(":") > 0) {
              const afterArr = after.split(":");
              const event = afterArr[0];
              const selector = afterArr.slice(1).join(":");
              requestFunction = (options, templateObject) => {
                setEvents(event, selector, options, templateObject);
              };
            } else {
              createError(
                `${AFTER_ATTR} attribute doesn't work without EventTargets`
              );
            }
          } else {
            if (oldMode) {
              createError(
                `${MODE_ATTR} attribute doesn't work without ${AFTER_ATTR}`
              );
            }
          }
          return fn(requestFunction);
        }
      } else {
        createError(`The "source" attribute are not found or empty`);
      }
    };
    /**
     *
     * @param {string} template
     */
    const createTemplate = (template) => {
      if (typeof template !== "string")
        createError(
          "template was not found or the type of the passed value is not string"
        );
      const getElement = (template) => {
        const elementDocument = new DOMParser().parseFromString(
          `<template>${template}</template>`,
          "text/html"
        );
        const elWrapper =
          elementDocument.childNodes[0].childNodes[0].firstChild;
        //@ts-expect-error elWrapper not found
        if (elWrapper.content.children.length > 1) {
          createError("Template include only one node with type 'Element'");
        }
        const prepareNode = (node) => {
          switch (node.nodeType) {
            case Node.ELEMENT_NODE:
              if (node.tagName === "pre") return;
              break;
            case Node.TEXT_NODE:
              if (!/\S/.test(node.textContent)) {
                node.remove();
                return;
              }
              break;
          }
          for (let i = 0; i < node.childNodes.length; i++) {
            prepareNode(node.childNodes.item(i));
          }
        };
        //@ts-expect-error elWrapper not found
        prepareNode(elWrapper.content.childNodes[0]);
        //@ts-expect-error elWrapper not found
        const currentEl = elWrapper.content.firstElementChild;
        if (
          currentEl?.nodeName !== NODE_ATTR ||
          currentEl.getAttribute(HMPL_ATTRIBUTE) === null
        ) {
          createError(
            `Other nodes, except those with the name "${NODE_ATTR}" and attribute "${HMPL_ATTRIBUTE}", are not yet supported`
          );
        }
        return currentEl;
      };
      const el = getElement(template);
      const renderFn = (requestFunction) => {
        /**
         *
         * @param {{
         * mode?:RequestMode;
         * cache?:RequestCache;
         * redirect?:RequestRedirect;
         * referrerPolicy?:ReferrerPolicy;
         * get?:(prop:string,value:any)=>void;
         * requestBody?: BodyInit | null;
         * credentials?: RequestCredentials;
         * headers?:{
         *  [key: string]: string;
         * }
         * timeout?: number;}} options
         * @returns {{ status:number, element: undefined | HTMLTemplateElement }}
         */
        const templateFunction = (options = {}) => {
          const templateObject = {
            element: undefined,
            status: 0
          };
          if (options.get) {
            if (!checkFunction(options.get)) {
              createError("The get property has a function value");
            }
          }
          requestFunction(options, templateObject);
          return templateObject;
        };
        return templateFunction;
      };
      return renderTemplate(el, renderFn, true);
    };
    const hmpl = {
      createTemplate
    };
    const renderFunction = () => {
      const templates = doc().querySelectorAll(`[${HMPL_ATTRIBUTE}]`);
      for (let i = 0; i < templates.length; i++) {
        const el = templates[i];
        if (el.parentNode === null) {
          createError(`"parentNode" is null`);
        }
        if (el.nodeName !== NODE_ATTR)
          createError(
            `Other nodes, except those with the name "${NODE_ATTR}", are not yet supported`
          );
        const renderFn = (requestFunction) => {
          requestFunction();
        };
        renderTemplate(el, renderFn);
      }
    };
    if (doc().readyState === "loading") {
      doc().addEventListener("DOMContentLoaded", renderFunction);
    } else renderFunction();
    return hmpl;
  })();
});
