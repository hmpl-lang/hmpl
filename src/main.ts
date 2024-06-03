"use strict";

import {
  HMPLData,
  HMPLRenderFunction,
  HMPLRequest,
  HMPLRequestFunction,
  HMPLRequestOptions,
  HMPLTemplateObject,
  HMPLIdentificationOptions
} from "./types";

const checkObject = (val: any) => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};
const checkFunction = (val: any) => {
  return Object.prototype.toString.call(val) === "[object Function]";
};
const createError = (text: string) => {
  throw new Error(text);
};
const getIsMethodValid = (method: string) => {
  return (
    method !== "get" &&
    method !== "post" &&
    method !== "put" &&
    method !== "delete" &&
    method !== "patch"
  );
};
const NODE_ATTR = "REQUEST";
const SOURCE_ATTR = `src`;
const METHOD_ATTR = `method`;
const ID_ATTR = `ref`;
const AFTER_ATTR = `after`;
const MODE_ATTR = `mode`;

const getResponseElements = (response: string) => {
  if (typeof response !== "string") createError("Bad response");
  const elementDocument = new DOMParser().parseFromString(
    `<template>${response}</template>`,
    "text/html"
  );
  const elWrapper = elementDocument.childNodes[0].childNodes[0].firstChild;
  const elContent = elWrapper!["content"];
  const scripts = elContent.querySelectorAll("script");
  for (let i = 0; i < scripts.length; i++) {
    const currentScript = scripts[i];
    elContent.removeChild(currentScript);
  }
  return elWrapper;
};
const makeRequest = (
  el: undefined | Element,
  mainEl: undefined | Element,
  dataObj: HMPLData | undefined,
  method: string,
  source: string,
  isRequest: boolean,
  isRequests: boolean,
  options: HMPLRequestOptions = {},
  templateObject: HMPLTemplateObject,
  reqObject?: HMPLRequest
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
    body
  } = options;
  const initRequest: RequestInit = {
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
  // const isMain = !!mainEl;
  const updateStatus = (status: number) => {
    if (isRequests) {
      if (reqObject!.status !== status) {
        reqObject!.status = status;
        get?.("status", status, reqObject);
      }
    } else {
      if (templateObject.status !== status) {
        templateObject.status = status;
        get?.("status", status);
      }
    }
  };
  updateStatus(0);
  fetch(source, initRequest)
    .then((response) => {
      updateStatus(response.status);
      if (!response.ok) {
        createError(`Request error with code ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const templateWrapper = getResponseElements(data);
      if (isRequest) {
        (templateObject.response as any) = templateWrapper;
        get?.("response", templateWrapper);
      } else {
        let reqResponse: ChildNode[] = [];
        const nodes = (templateWrapper as HTMLTemplateElement).content
          .childNodes;
        if (dataObj) {
          if (dataObj.nodes) {
            const parentNode = dataObj.parentNode! as ParentNode;
            if (!parentNode) createError("parentNode is null");
            const newNodes: ChildNode[] = [];
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
            const parentNode = el!.parentNode as ParentNode;
            const newNodes: ChildNode[] = [];
            for (let i = 0; i < nodes.length; i++) {
              const node = nodes[i];
              const newNode = parentNode.insertBefore(node, el!);
              newNodes.push(newNode);
            }
            parentNode.removeChild(el!);
            reqResponse = newNodes.slice();
            dataObj.nodes = newNodes;
            dataObj.parentNode = parentNode;
          }
        } else {
          const parentNode = el!.parentNode as ParentNode;
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const reqNode = parentNode.insertBefore(node, el!);
            if (isRequests) {
              reqResponse.push(reqNode);
            }
          }
          parentNode.removeChild(el!);
        }
        if (isRequests) {
          reqObject!.response = reqResponse;
          get?.("response", reqResponse, reqObject);
        }
        get?.("response", mainEl);
      }
    })
    .catch((error) => {
      throw error;
    });
};
const renderTemplate = (
  currentEl: Element,
  fn: HMPLRenderFunction,
  isRequest: boolean = false
) => {
  const renderEl = (el: Element, mainEl?: Element) => {
    const source = el.getAttribute(SOURCE_ATTR);
    if (source) {
      const method = (el.getAttribute(METHOD_ATTR) || "GET").toLowerCase();
      if (getIsMethodValid(method)) {
        createError(
          `${METHOD_ATTR} has only GET, POST, PUT, PATCH or DELETE values`
        );
      } else {
        const after = el.getAttribute(AFTER_ATTR);
        if (after && isRequest) createError("EventTarget is undefined");
        let oldMode = el.getAttribute(MODE_ATTR);
        let modeAttr = (oldMode || "all").toLowerCase();
        if (modeAttr !== "one" && modeAttr !== "all")
          createError(`${MODE_ATTR} has only ONE or ALL values`);
        const optionsId = el.getAttribute(ID_ATTR);
        const isAll = modeAttr === "all";
        let dataObj: HMPLData;
        if (isAll && after) {
          dataObj = {
            nodes: null,
            parentNode: null
          };
        }
        const getOptions = (
          options: HMPLRequestOptions | HMPLIdentificationOptions[],
          isArray: boolean = false
        ): HMPLRequestOptions => {
          if (isArray) {
            if (optionsId) {
              let result: HMPLRequestOptions | undefined;
              for (
                let i = 0;
                i < (options as HMPLIdentificationOptions[]).length;
                i++
              ) {
                const currentOptions = options[i] as HMPLIdentificationOptions;
                if (currentOptions.id === optionsId) {
                  result = currentOptions.options;
                  break;
                }
              }
              if (!result) {
                createError("id referenced by request not found");
              }
              return result as HMPLRequestOptions;
            } else {
              return {};
            }
          } else {
            if (optionsId) createError("id referenced by request not found");
            return options as HMPLRequestOptions;
          }
        };
        const reqFunction: HMPLRequestFunction = (
          options: HMPLRequestOptions | HMPLIdentificationOptions[],
          templateObject: HMPLTemplateObject,
          isArray: boolean = false,
          reqObject?: HMPLRequest,
          isRequests: boolean = false
        ) => {
          const currentOptions = getOptions(options, isArray);
          makeRequest(
            el,
            mainEl,
            dataObj,
            method,
            source,
            isRequest,
            isRequests,
            currentOptions,
            templateObject,
            reqObject
          );
        };
        let requestFunction = reqFunction;
        if (after) {
          const setEvents = (
            event: string,
            selector: string,
            options: HMPLRequestOptions | HMPLIdentificationOptions[],
            templateObject: HMPLTemplateObject,
            isArray: boolean,
            isRequests: boolean,
            reqObject?: HMPLRequest
          ) => {
            const els = mainEl!.querySelectorAll(selector);
            const afterFn = isAll
              ? () => {
                  reqFunction(
                    options,
                    templateObject,
                    isArray,
                    reqObject,
                    isRequests
                  );
                }
              : () => {
                  reqFunction(
                    options,
                    templateObject,
                    isArray,
                    reqObject,
                    isRequests
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
              options,
              templateObject,
              isArray: boolean = false,
              reqObject,
              isRequests = false
            ) => {
              const currentOptions = getOptions(options, isArray);
              setEvents(
                event,
                selector,
                currentOptions,
                templateObject,
                isArray,
                isRequests,
                reqObject
              );
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
        return requestFunction;
      }
    } else {
      createError(`The "source" attribute are not found or empty`);
    }
  };

  let reqFn: any;
  if (isRequest) {
    reqFn = renderEl(currentEl);
  } else {
    const requests = currentEl.querySelectorAll(`${NODE_ATTR}`);
    const algorithm: HMPLRequestFunction[] = [];
    if (requests.length > 1) {
      for (let i = 0; i < requests.length; i++) {
        const el = requests[i];
        if (el.parentNode === null) {
          createError(`"parentNode" is null`);
        }
        const algorithmFn = renderEl(el, currentEl);
        algorithm.push(algorithmFn!);
      }
      reqFn = (
        options: HMPLRequestOptions | HMPLIdentificationOptions[],
        templateObject: HMPLTemplateObject,
        isArray: boolean = false
      ) => {
        const requests: HMPLRequest[] = [];
        for (let i = 0; i < algorithm.length; i++) {
          const currentReq: HMPLRequest = {
            response: undefined,
            status: 0
          };
          const currentReqFn = algorithm[i];
          currentReqFn(options, templateObject, isArray, currentReq, true);
          requests.push(currentReq);
        }
        templateObject.requests = requests;
      };
    } else {
      const el = requests[0];
      if (el.parentNode === null) {
        createError(`"parentNode" is null`);
      }
      reqFn = renderEl(el, currentEl);
    }
  }
  return fn(reqFn!);
};
const validOptions = (currentOptions: HMPLRequestOptions) => {
  if (currentOptions.get) {
    if (!checkFunction(currentOptions.get)) {
      createError("The get property has a function value");
    }
  }
};
const validIdentificationOptionsArray = (
  currentOptions: HMPLIdentificationOptions[]
) => {
  const ids: string[] = [];
  for (let i = 0; i < currentOptions.length; i++) {
    const idOptions = currentOptions[i];
    if (!checkObject(idOptions)) createError(`options is of type "object"`);
    validOptions(idOptions as HMPLRequestOptions);
    const { id } = idOptions;
    if (typeof idOptions.id !== "string") createError(`id is of type "string"`);
    if (ids.indexOf(id) > -1) {
      createError(`id with value "${id}" already exists`);
    } else {
      ids.push(id);
    }
  }
};
export const compile = (template: string) => {
  if (typeof template !== "string")
    createError(
      "template was not found or the type of the passed value is not string"
    );
  const getElement = (template: string) => {
    const elementDocument = new DOMParser().parseFromString(
      `<template>${template}</template>`,
      "text/html"
    );
    const elWrapper = elementDocument.childNodes[0].childNodes[0]
      .firstChild as HTMLTemplateElement;
    if (elWrapper.content.children.length > 1) {
      createError("Template include only one node with type 'Element'");
    }
    const prepareNode = (node: ChildNode) => {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          if ((node as Element).tagName === "pre") return;
          break;
        case Node.TEXT_NODE:
          if (!/\S/.test(node.textContent!)) {
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
    const currentEl = elWrapper.content.firstElementChild;
    return currentEl;
  };
  const el = getElement(template);
  if (!el) createError("Element is undefined");
  const isRequest = el!.nodeName === NODE_ATTR;
  const renderFn: HMPLRenderFunction = (
    requestFunction: HMPLRequestFunction
  ) => {
    const templateFunction = (
      options: HMPLIdentificationOptions[] | HMPLRequestOptions = {}
    ): HMPLTemplateObject => {
      const templateObject: HMPLTemplateObject = {
        response: isRequest ? undefined : el
      };
      if (isRequest) {
        templateObject.status = 0;
      }
      if (checkObject(options)) {
        validOptions(options as HMPLRequestOptions);
        requestFunction(options as HMPLRequestOptions, templateObject);
      } else if (Array.isArray(options)) {
        validIdentificationOptionsArray(options as HMPLIdentificationOptions[]);
        requestFunction(
          options as HMPLIdentificationOptions[],
          templateObject,
          true
        );
      }
      return templateObject;
    };
    return templateFunction;
  };
  return renderTemplate(el as Element, renderFn, isRequest);
};
