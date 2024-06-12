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

export interface HMPLIdentificationOptions {
  options: HMPLRequestOptions;
  id: string;
}

export interface HMPLNodeObj {
  id: number;
  nodes: null | ChildNode[];
  parentNode: null | ParentNode;
}

export interface HMPLRequest {
  response: undefined | Element | null | ChildNode[];
  status: number;
}

export interface HMPLInstance {
  response: undefined | Element | null;
  status?: number;
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
