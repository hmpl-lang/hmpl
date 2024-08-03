"use strict";

export type HMPLRequestGet = (
  prop: string,
  value: any,
  request?: HMPLRequest
) => void;

export interface HMPLHeaders {
  [key: string]: string;
}

export interface HMPLRequestOptions {
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
  headers?: HMPLHeaders;
  timeout?: number;
}

export interface HMPLRequestsObject extends HMPLRequestData {
  startId?: number;
  endId?: number;
  el?: Comment;
  nodeId?: number;
}

export type HMPLInitalStatus =
  | "pending"
  | "rejected"
  | 100
  | 101
  | 102
  | 103
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

export type HMPLIndicatorTrigger = HMPLInitalStatus | "error";

export interface HMPLIndicator {
  trigger: HMPLIndicatorTrigger;
  content: string;
}

export interface HMPLRequestData {
  src: string;
  method: string;
  optionsId?: string | number;
  after?: string;
  mode?: string;
  indicators?: HMPLIndicator[];
}

export interface HMPLParsedIndicators {
  [key: string]: HTMLTemplateElement;
}

export interface HMPLTemplate {
  requests: HMPLRequestsObject[];
}

export interface HMPLIdentificationOptions {
  value: HMPLRequestOptions;
  id: string;
}

export interface HMPLNodeObj {
  id: number;
  nodes: null | ChildNode[];
  parentNode: null | ParentNode;
  comment: Comment;
}

export interface HMPLCurrentRequest {
  startId: number;
  endId: number;
}

export type HMPLStatus =
  | HMPLInitalStatus
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226;

export interface HMPLRequest {
  response: undefined | Element | null | ChildNode[];
  status?: HMPLStatus;
}

export interface HMPLInstance {
  response: undefined | Element | null;
  status?: HMPLStatus;
  requests?: HMPLRequest[];
}

export interface HMPLElement {
  el: Element;
  id: number;
  objNode?: HMPLNodeObj;
}

export interface HMPLData {
  dataObjects: HMPLNodeObj[];
  els: HMPLElement[];
  currentId: number;
}

export type HMPLRequestFunction = (
  el: Element,
  options: HMPLRequestOptions | HMPLIdentificationOptions[],
  templateObject: HMPLInstance,
  data: HMPLData,
  mainEl?: Element,
  isArray?: boolean,
  reqObject?: HMPLRequest,
  isRequests?: boolean,
  currentHMPLElement?: HMPLElement
) => void;

export type HMPLRenderFunction = (
  requestFunction: HMPLRequestFunction
) => (
  options?: HMPLRequestOptions | HMPLIdentificationOptions[]
) => HMPLInstance;

export type HMPLCompile = (template: string) => HMPLTemplateFunction;

export type HMPLTemplateFunction = (
  options?: HMPLIdentificationOptions[] | HMPLRequestOptions
) => HMPLInstance;
