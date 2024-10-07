"use strict";

// Common HTTP status codes grouped by category
type HttpInformationalStatus = 100 | 101 | 102 | 103;
type HttpRedirectionStatus = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
type HttpClientErrorStatus = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451;
type HttpServerErrorStatus = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;
type HttpSuccessStatus = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;

// Base types
type HMPLRequestGet = (prop: string, value: any, request?: HMPLRequest) => void;
type HMPLPromiseStatus = "pending" | "rejected";
type HMPLInitalStatus = HMPLPromiseStatus | HttpInformationalStatus | HttpRedirectionStatus | HttpClientErrorStatus | HttpServerErrorStatus;
type HMPLRequestStatus = HMPLInitalStatus | HttpSuccessStatus;
type HMPLIndicatorTrigger = HMPLInitalStatus | "error";

// Interfaces
interface HMPLHeadersInit {
  [key: string]: string;
}

interface HMPLRequestInit {
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  referrer?: string;
  get?: HMPLRequestGet;
  body?: BodyInit | null;
  signal?: AbortSignal | null;
  window?: any;
  credentials?: RequestCredentials;
  headers?: HMPLHeadersInit;
  timeout?: number;
}

interface HMPLRequestInfo {
  src: string;
  method: string;
  initId?: string | number;
  after?: string;
  repeat?: boolean;
  memo?: boolean;
  indicators?: HMPLIndicator[];
}

interface HMPLRequestsObject extends HMPLRequestInfo {
  startId?: number;
  endId?: number;
  el?: Comment;
  nodeId?: number;
}

interface HMPLIndicator {
  trigger: HMPLIndicatorTrigger;
  content: string;
}

interface HMPLCompileOptions {
  memo?: boolean;
}

interface HMPLParsedIndicators {
  [key: string]: HTMLTemplateElement;
}

interface HMPLTemplate {
  requests: HMPLRequestsObject[];
}

interface HMPLIdentificationRequestInit {
  value: HMPLRequestInit;
  id: string | number;
}

interface HMPLNodeObj {
  id: number;
  nodes: null | ChildNode[];
  parentNode: null | ParentNode;
  comment: Comment;
  memo?: {
    response: null | string;
    isPending?: boolean;
    nodes?: ChildNode[];
  };
}

interface HMPLCurrentRequest {
  startId: number;
  endId: number;
}

interface HMPLRequest {
  response: undefined | Element | null | ChildNode[];
  status?: HMPLRequestStatus;
}

interface HMPLInstance {
  response: undefined | Element | null;
  status?: HMPLRequestStatus;
  requests?: HMPLRequest[];
}

interface HMPLElement {
  el: Element;
  id: number;
  objNode?: HMPLNodeObj;
}

interface HMPLData {
  dataObjects: HMPLNodeObj[];
  els: HMPLElement[];
  currentId: number;
}

// Function types
type HMPLRequestFunction = (
  el: Element,
  options: HMPLRequestInit | HMPLIdentificationRequestInit[],
  templateObject: HMPLInstance,
  data: HMPLData,
  mainEl?: Element,
  isArray?: boolean,
  reqObject?: HMPLRequest,
  isRequests?: boolean,
  currentHMPLElement?: HMPLElement
) => void;

type HMPLRenderFunction = (
  requestFunction: HMPLRequestFunction
) => (
  options?: HMPLRequestInit | HMPLIdentificationRequestInit[]
) => HMPLInstance;

type HMPLCompile = (
  template: string,
  options?: HMPLCompileOptions
) => HMPLTemplateFunction;

type HMPLTemplateFunction = (
  options?: HMPLIdentificationRequestInit[] | HMPLRequestInit
) => HMPLInstance;

// Exports
export {
  HMPLRequestGet,
  HMPLHeadersInit,
  HMPLRequestInit,
  HMPLRequestsObject,
  HMPLInitalStatus,
  HMPLIndicatorTrigger,
  HMPLIndicator,
  HMPLRequestInfo,
  HMPLCompileOptions,
  HMPLParsedIndicators,
  HMPLTemplate,
  HMPLIdentificationRequestInit,
  HMPLNodeObj,
  HMPLCurrentRequest,
  HMPLRequestStatus,
  HMPLRequest,
  HMPLInstance,
  HMPLElement,
  HMPLData,
  HMPLRequestFunction,
  HMPLRenderFunction,
  HMPLCompile,
  HMPLTemplateFunction
};