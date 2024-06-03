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
  get?: HMPLRequestGet;
  body?: BodyInit | null;
  credentials?: RequestCredentials;
  headers?: HMPLHeaders;
  timeout?: number;
}

export interface HMPLIdentificationOptions {
  options: HMPLRequestOptions;
  id: string;
}

export interface HMPLData {
  nodes: null | ChildNode[];
  parentNode: null | ParentNode;
}

export interface HMPLRequest {
  response: undefined | Element | null | ChildNode[];
  status: number;
  id?: string;
}

export interface HMPLTemplateObject {
  response: undefined | Element | null;
  status?: number;
  requests?: HMPLRequest[];
}

export type HMPLRequestFunction = (
  options: HMPLRequestOptions | HMPLIdentificationOptions[],
  templateObject: HMPLTemplateObject,
  isArray?: boolean,
  reqObject?: HMPLRequest,
  isRequests?: boolean
) => void;

export type HMPLRenderFunction = (
  requestFunction: HMPLRequestFunction
) => (
  options?: HMPLRequestOptions | HMPLIdentificationOptions[]
) => HMPLTemplateObject;
