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
    const createWarning = (text) => {
      console.warn(text);
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
    const SOURCE = `src`;
    const METHOD = `method`;
    const ID = `ref`;
    const AFTER = `after`;
    const MODE = `mode`;
    const ON = `on`;
    const MAIN_REGEX = /([{}])/;
    // http codes without successful
    const codes = [
      100, 101, 102, 103, 300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401,
      402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416,
      417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502,
      503, 504, 505, 506, 507, 508, 510, 511
    ];
    const getTemplateWrapper = (str) => {
      const elementDocument = new DOMParser().parseFromString(
        `<template>${str}</template>`,
        "text/html"
      );
      const elWrapper = elementDocument.childNodes[0].childNodes[0].firstChild;
      return elWrapper;
    };
    const getResponseElements = (response) => {
      if (typeof response !== "string") createError("Bad response");
      const elWrapper = getTemplateWrapper(response);
      const elContent = elWrapper["content"];
      const scripts = elContent.querySelectorAll("script");
      for (let i = 0; i < scripts.length; i++) {
        const currentScript = scripts[i];
        elContent.removeChild(currentScript);
      }
      return elWrapper;
    };
    const makeRequest = (
      el,
      mainEl,
      dataObj,
      method,
      source,
      isRequest,
      isRequests,
      options = {},
      templateObject,
      reqObject,
      on
    ) => {
      const {
        mode,
        cache,
        redirect,
        get,
        referrerPolicy,
        signal,
        credentials,
        timeout,
        referrer,
        headers,
        body,
        window: windowOption,
        integrity
      } = options;
      const initRequest = {
        method: method.toUpperCase()
      };
      if (credentials !== undefined) {
        initRequest.credentials = credentials;
      }
      if (body !== undefined) {
        initRequest.body = body;
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
      if (integrity !== undefined) {
        initRequest.integrity = integrity;
      }
      if (referrer !== undefined) {
        initRequest.referrer = referrer;
      }
      const isHaveSignal = signal !== undefined;
      if (isHaveSignal) {
        initRequest.signal = signal;
      }
      if (windowOption !== undefined) {
        initRequest.window = windowOption;
      }
      if (options.keepalive !== undefined) {
        createWarning("keepalive property is not yet supported");
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
        if (!isHaveSignal) {
          initRequest.signal = AbortSignal.timeout(timeout);
        } else {
          createWarning(
            "The signal property overwrote the AbortSignal from timeout"
          );
        }
      }
      const updateNodes = (content, isClone = true) => {
        if (isRequest) {
          templateObject.response = content.cloneNode(true);
          get?.("response", content);
        } else {
          let reqResponse = [];
          const newContent = isClone ? content.cloneNode(true) : content;
          const nodes = newContent.content.childNodes;
          if (dataObj.nodes) {
            const parentNode = dataObj.parentNode;
            if (!parentNode) createError("parentNode is null");
            const newNodes = [];
            const nodesLength = dataObj.nodes.length;
            for (let i = 0; i < nodesLength; i++) {
              const node = dataObj.nodes[i];
              if (i === nodesLength - 1) {
                for (let j = 0; j < nodes.length; j++) {
                  const reqNode = nodes[j];
                  const newNode = parentNode.insertBefore(reqNode, node);
                  newNodes.push(newNode);
                }
              }
              parentNode.removeChild(node);
            }
            reqResponse = newNodes.slice();
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
            reqResponse = newNodes.slice();
            dataObj.nodes = newNodes;
            dataObj.parentNode = parentNode;
          }
          if (isRequests) {
            reqObject.response = reqResponse;
            get?.("response", reqResponse, reqObject);
          }
          get?.("response", mainEl);
        }
      };
      let isOverlap = false;
      let isNotHTMLResponse = false;
      const updateIndicator = (status) => {
        if (on) {
          if (status === 0) {
            const content = on["loading"];
            if (content !== undefined) {
              updateNodes(content);
            }
          } else if (status === -1) {
            const content = on["error"];
            if (content !== undefined) {
              updateNodes(content);
            } else {
              if (dataObj.nodes) {
                const parentNode = dataObj.parentNode;
                if (!parentNode) createError("parentNode is null");
                const nodesLength = dataObj.nodes.length;
                for (let i = 0; i < nodesLength; i++) {
                  const node = dataObj.nodes[i];
                  if (i === nodesLength - 1) {
                    parentNode.insertBefore(dataObj.comment, node);
                  }
                  parentNode.removeChild(node);
                }
                dataObj.nodes = null;
                dataObj.parentNode = null;
              }
            }
          } else {
            const content = on[`${status}`];
            if (status > 399) {
              const errorContent = on["error"];
              if (content !== undefined) {
                if (errorContent !== undefined) {
                  isOverlap = true;
                }
                updateNodes(content);
              }
            } else {
              if (content !== undefined) {
                isNotHTMLResponse = true;
                updateNodes(content);
              }
            }
          }
        }
      };
      const updateRequestObject = (status) => {
        if (isRequests) {
          if (reqObject.status !== status) {
            reqObject.status = status;
            get?.("status", status, reqObject);
          }
        } else {
          if (templateObject.status !== status) {
            templateObject.status = status;
            get?.("status", status);
          }
        }
        updateIndicator(status);
      };
      updateRequestObject(0);
      fetch(source, initRequest)
        .then((response) => {
          updateRequestObject(response.status);
          if (!response.ok) {
            createError(`Request error with code ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          if (!isNotHTMLResponse) {
            const templateWrapper = getResponseElements(data);
            if (isRequest) {
              templateObject.response = templateWrapper;
              get?.("response", templateWrapper);
            } else {
              const reqResponse = [];
              const nodes = templateWrapper.content.childNodes;
              if (dataObj) {
                updateNodes(templateWrapper, false);
              } else {
                const parentNode = el.parentNode;
                for (let i = 0; i < nodes.length; i++) {
                  const node = nodes[i];
                  const reqNode = parentNode.insertBefore(node, el);
                  if (isRequests) {
                    reqResponse.push(reqNode);
                  }
                }
                parentNode.removeChild(el);
                if (isRequests) {
                  reqObject.response = reqResponse;
                  get?.("response", reqResponse, reqObject);
                }
                get?.("response", mainEl);
              }
            }
          }
        })
        .catch((error) => {
          if (!isOverlap) updateIndicator(-1);
          throw error;
        });
    };
    const renderTemplate = (currentEl, fn, requests, isRequest = false) => {
      const renderRequest = (req, mainEl) => {
        const source = req.src;
        if (source) {
          const method = (req.method || "GET").toLowerCase();
          if (getIsMethodValid(method)) {
            createError(
              `${METHOD} has only GET, POST, PUT, PATCH or DELETE values`
            );
          } else {
            const after = req.after;
            if (after && isRequest) createError("EventTarget is undefined");
            const oldMode = req.mode;
            const modeAttr = (oldMode || "all").toLowerCase();
            if (modeAttr !== "one" && modeAttr !== "all")
              createError(`${MODE} has only ONE or ALL values`);
            const optionsId = req.ref;
            const isAll = modeAttr === "all";
            const nodeId = req.nodeId;
            let on = req.on;
            if (on) {
              const parseIndicator = (val) => {
                const { trigger, content } = val;
                if (!trigger) createError("Indicator trigger error");
                if (!content) createError("Indicator content error");
                if (
                  codes.indexOf(trigger) === -1 &&
                  trigger !== "loading" &&
                  trigger !== "error"
                ) {
                  createError("Indicator trigger error");
                }
                const elWrapper = getTemplateWrapper(content);
                return {
                  ...val,
                  content: elWrapper
                };
              };
              if (checkObject(on)) {
                const parsedIndicator = parseIndicator(on);
                on = {
                  [`${parsedIndicator.trigger}`]: parsedIndicator.content
                };
              } else {
                const newOn = {};
                const uniqueTriggers = [];
                for (let i = 0; i < on.length; i++) {
                  const currentIndicator = parseIndicator(on[i]);
                  const { trigger } = currentIndicator;
                  if (uniqueTriggers.indexOf(trigger) === -1) {
                    uniqueTriggers.push(trigger);
                  } else {
                    createError("Indicator trigger must be unique");
                  }
                  newOn[`${trigger}`] = currentIndicator.content;
                }
                on = newOn;
              }
            }
            const getOptions = (options, isArray = false) => {
              if (isArray) {
                if (optionsId) {
                  let result;
                  for (let i = 0; i < options.length; i++) {
                    const currentOptions = options[i];
                    if (currentOptions.id === optionsId) {
                      result = currentOptions.options;
                      break;
                    }
                  }
                  if (!result) {
                    createError("id referenced by request not found");
                  }
                  return result;
                } else {
                  return {};
                }
              } else {
                if (optionsId)
                  createError("id referenced by request not found");
                return options;
              }
            };
            const isDataObj = isAll && after;
            const reqFunction = (
              reqEl,
              options,
              templateObject,
              data,
              reqMainEl,
              isArray = false,
              reqObject,
              isRequests = false,
              currentHMPLElement
            ) => {
              const id = data.currentId;
              if (isRequest) {
                if (!reqEl) reqEl = mainEl;
              } else {
                if (!reqEl) {
                  if (currentHMPLElement) {
                    reqEl = currentHMPLElement.el;
                  } else {
                    let currentEl;
                    const { els } = data;
                    for (let i = 0; i < els.length; i++) {
                      const e = els[i];
                      if (e.id === nodeId) {
                        currentHMPLElement = e;
                        currentEl = e.el;
                        break;
                      }
                    }
                    if (!currentEl) {
                      createError("Element error");
                    }
                    reqEl = currentEl;
                  }
                }
              }
              let dataObj;
              if (!isRequest) {
                if (isDataObj || on) {
                  if (!currentHMPLElement) createError("Element error");
                  dataObj = currentHMPLElement.objNode;
                  if (!dataObj) {
                    dataObj = {
                      id,
                      nodes: null,
                      parentNode: null,
                      comment: reqEl
                    };
                    currentHMPLElement.objNode = dataObj;
                    data.dataObjects.push(dataObj);
                    data.currentId++;
                  }
                }
              }
              const currentOptions = getOptions(options, isArray);
              makeRequest(
                reqEl,
                reqMainEl,
                dataObj,
                method,
                source,
                isRequest,
                isRequests,
                currentOptions,
                templateObject,
                reqObject,
                on
              );
            };
            let requestFunction = reqFunction;
            if (after) {
              const setEvents = (
                reqEl,
                event,
                selector,
                options,
                templateObject,
                data,
                isArray,
                isRequests,
                reqMainEl,
                reqObject,
                currentHMPLElement
              ) => {
                const els = reqMainEl.querySelectorAll(selector);
                if (els.length === 0) {
                  createError("Selectors nodes not found");
                }
                const afterFn = isAll
                  ? () => {
                      reqFunction(
                        reqEl,
                        options,
                        templateObject,
                        data,
                        reqMainEl,
                        isArray,
                        reqObject,
                        isRequests,
                        currentHMPLElement
                      );
                    }
                  : () => {
                      reqFunction(
                        reqEl,
                        options,
                        templateObject,
                        data,
                        reqMainEl,
                        isArray,
                        reqObject,
                        isRequests,
                        currentHMPLElement
                      );
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
                requestFunction = (
                  reqEl,
                  options,
                  templateObject,
                  data,
                  reqMainEl,
                  isArray = false,
                  reqObject,
                  isRequests = false,
                  currentHMPLElement
                ) => {
                  setEvents(
                    reqEl,
                    event,
                    selector,
                    options,
                    templateObject,
                    data,
                    isArray,
                    isRequests,
                    reqMainEl,
                    reqObject,
                    currentHMPLElement
                  );
                };
              } else {
                createError(
                  `${AFTER} attribute doesn't work without EventTargets`
                );
              }
            } else {
              if (oldMode) {
                createError(`${MODE} attribute doesn't work without ${AFTER}`);
              }
            }
            return requestFunction;
          }
        } else {
          createError(`The "source" attribute are not found or empty`);
        }
      };
      let reqFn;
      if (isRequest) {
        requests[0].el = currentEl;
        reqFn = renderRequest(requests[0]);
      } else {
        let id = -2;
        const getRequests = (currrentElement) => {
          id++;
          if (currrentElement.nodeType == 8) {
            let value = currrentElement.nodeValue;
            if (value && value.startsWith("hmpl")) {
              value = value.slice(4);
              const currentIndex = Number(value);
              const currentRequest = requests[currentIndex];
              if (Number.isNaN(currentIndex) || currentRequest === undefined) {
                createError("Request index error");
              }
              currentRequest.el = currrentElement;
              currentRequest.nodeId = id;
            }
          }
          if (currrentElement.hasChildNodes()) {
            const chNodes = currrentElement.childNodes;
            for (let i = 0; i < chNodes.length; i++) {
              getRequests(chNodes[i]);
            }
          }
        };
        getRequests(currentEl);
        const algorithm = [];
        for (let i = 0; i < requests.length; i++) {
          const currentRequest = requests[i];
          algorithm.push(renderRequest(currentRequest, currentEl));
        }
        if (requests.length > 1) {
          reqFn = (
            reqEl,
            options,
            templateObject,
            data,
            mainEl,
            isArray = false
          ) => {
            if (!reqEl) {
              reqEl = mainEl;
            }
            const requests = [];
            const els = data.els;
            for (let i = 0; i < els.length; i++) {
              const hmplElement = els[i];
              const currentReqEl = hmplElement.el;
              if (currentReqEl.parentNode === null) {
                createError(`"parentNode" is null`);
              }
              const currentReqFn = algorithm[i];
              const currentReq = {
                response: undefined,
                status: 0
              };
              currentReqFn(
                currentReqEl,
                options,
                templateObject,
                data,
                reqEl,
                isArray,
                currentReq,
                true,
                hmplElement
              );
              requests.push(currentReq);
            }
            templateObject.requests = requests;
          };
        } else {
          const currentRequest = requests[0];
          if (currentRequest.el.parentNode === null) {
            createError(`"parentNode" is null`);
          }
          reqFn = renderRequest(currentRequest, currentEl);
        }
      }
      return fn(reqFn);
    };
    const validOptions = (currentOptions) => {
      if (currentOptions.get) {
        if (!checkFunction(currentOptions.get)) {
          createError("The get property has a function value");
        }
      }
    };
    const validIdentificationOptionsArray = (currentOptions) => {
      const ids = [];
      for (let i = 0; i < currentOptions.length; i++) {
        const idOptions = currentOptions[i];
        if (!checkObject(idOptions)) createError(`options is of type "object"`);
        validOptions(idOptions);
        const { id } = idOptions;
        if (typeof idOptions.id !== "string")
          createError(`id is of type "string"`);
        if (ids.indexOf(id) > -1) {
          createError(`id with value "${id}" already exists`);
        } else {
          ids.push(id);
        }
      }
    };
    const stringify = (data) => {
      return JSON.stringify(data);
    };
    /**
     * @param {string} template
     */
    const compile = (template) => {
      if (typeof template !== "string")
        createError(
          "template was not found or the type of the passed value is not string"
        );
      if (!template) createError("template empty");
      const requests = [];
      const templateArr = template.split(MAIN_REGEX).filter(Boolean);
      let currentBracketId = -1;
      let previousBracket = undefined;
      let currentRequest;
      let currentData = "";
      for (let i = 0; i < templateArr.length; i++) {
        const text = templateArr[i];
        const isOpen = text === "{";
        const isClose = text === "}";
        if (isOpen) {
          if (currentBracketId > 1) {
            createError("Object nesting error");
          }
          if (currentBracketId === -1) {
            currentRequest = {
              startId: i,
              endId: NaN
            };
          } else {
            if (currentRequest) {
              currentData += text;
            }
          }
          currentBracketId++;
          previousBracket = true;
        } else if (isClose) {
          if (previousBracket && currentBracketId === 0) {
            createError("There are no query objects between the brackets");
          }
          if (currentBracketId === -1) {
            createError("Template error");
          } else {
            if (--currentBracketId === -1 && previousBracket !== undefined) {
              const prepareData = (text) => {
                text = text.trim();
                text = text.replace(/\r?\n|\r/g, "");
                return text;
              };
              const stringData = prepareData(currentData);
              const parsedData = JSON.parse(stringData);
              for (const key in parsedData) {
                const value = parsedData[key];
                if (
                  key !== SOURCE &&
                  key !== METHOD &&
                  key !== ID &&
                  key !== AFTER &&
                  key !== MODE &&
                  key !== ON
                )
                  createError(`Property ${key} is not processed`);
                if (key === ON) {
                  if (!checkObject(value) && !Array.isArray(value)) {
                    createError(
                      `The value of the property ${key} must be an object or an array`
                    );
                  }
                } else {
                  if (typeof value !== "string") {
                    createError(
                      `The value of the property ${key} must be a string`
                    );
                  }
                }
              }
              currentRequest.endId = i;
              const requestObject = {
                ...parsedData,
                ...currentRequest
              };
              requests.push(requestObject);
              previousBracket = undefined;
              currentRequest = undefined;
              currentData = "";
            } else {
              if (currentRequest) {
                currentData += text;
              }
              previousBracket = false;
            }
          }
        } else {
          if (currentRequest) {
            currentData += text;
          }
        }
      }
      if (requests.length === 0) {
        createError(`Request not found`);
      }
      let len = 0;
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        const comment = `<!--hmpl${i}-->`;
        const { startId, endId } = request;
        const currentLen = endId - startId;
        templateArr.splice(startId - len, currentLen + 1, comment);
        len += endId - startId;
        delete request.startId;
        delete request.endId;
      }
      template = templateArr.join("");
      let isRequest = false;
      const getElement = (template) => {
        const elWrapper = getTemplateWrapper(template);
        if (elWrapper.content.children.length > 1) {
          createError(
            `Template include only one node with type "Element" or "Comment"`
          );
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
        prepareNode(elWrapper.content.childNodes[0]);
        let currentEl = elWrapper.content.firstElementChild;
        if (!currentEl) {
          const comment = elWrapper.content.firstChild;
          const isComment = comment?.nodeType === 8;
          if (isComment) {
            isRequest = isComment;
            currentEl = comment;
          } else {
            createError("Element is undefined");
          }
        }
        return currentEl;
      };
      const templateEl = getElement(template);
      const renderFn = (requestFunction) => {
        const templateFunction = (options = {}) => {
          const el = templateEl.cloneNode(true);
          const templateObject = {
            response: isRequest ? undefined : el
          };
          if (isRequest) {
            templateObject.status = 0;
          }
          const data = {
            dataObjects: [],
            els: [],
            currentId: 0
          };
          if (!isRequest) {
            let id = -2;
            const getRequests = (currrentElement) => {
              id++;
              if (currrentElement.nodeType == 8) {
                const value = currrentElement.nodeValue;
                if (value && value.startsWith("hmpl")) {
                  const elObj = {
                    el: currrentElement,
                    id
                  };
                  data.els.push(elObj);
                }
              }
              if (currrentElement.hasChildNodes()) {
                const chNodes = currrentElement.childNodes;
                for (let i = 0; i < chNodes.length; i++) {
                  getRequests(chNodes[i]);
                }
              }
            };
            getRequests(el);
          }
          if (checkObject(options)) {
            validOptions(options);
            requestFunction(undefined, options, templateObject, data, el);
          } else if (Array.isArray(options)) {
            validIdentificationOptionsArray(options);
            requestFunction(undefined, options, templateObject, data, el, true);
          }
          return templateObject;
        };
        return templateFunction;
      };
      return renderTemplate(templateEl, renderFn, requests, isRequest);
    };

    const hmpl = {
      compile,
      stringify
    };
    return hmpl;
  })();
});
