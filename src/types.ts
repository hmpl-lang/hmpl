"use strict";

/**
 * get function in options object
 */
export type HMPLRequestGet = (
  prop: string,
  value: any,
  request?: HMPLRequest
) => void;

/**
 * headers object in options object
 */
export interface HMPLHeadersInit {
  [key: string]: string; // Key-value pairs representing HTTP headers
}

/**
 * A set of parameters that apply to fetch. Based almost entirely on [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit).
 */
interface HMPLRequestInit {
  mode?: RequestMode; // The mode of the request (cors, no-cors, same-origin)
  cache?: RequestCache; // The cache mode for the request (default, no-store, reload, etc.)
  redirect?: RequestRedirect; // How to handle redirects (follow, error, manual)
  referrerPolicy?: ReferrerPolicy; // Policy for the referrer header (no-referrer, same-origin, etc.)
  integrity?: string; // Subresource integrity value for the request
  referrer?: string; // The referrer URL for the request
  get?: HMPLRequestGet; // Optional function to retrieve properties from the request
  body?: BodyInit | null; // The body of the request (can be a string, FormData, etc.)
  signal?: AbortSignal | null; // An AbortSignal to abort the request if needed
  window?: any; // Reference to the window object (if applicable)
  credentials?: RequestCredentials; // Credentials mode for the request (omit, same-origin, include)
  headers?: HMPLHeadersInit; // Custom headers for the request
  timeout?: number; // Optional timeout duration for the request in milliseconds
}

/**
 * The context of the current request sent to the HMPLInstance.
 */
interface HMPLRequestContext {
  event?: Event;
}

/**
 * The HMPLInstance context contains information about requests sent to the server.
 */
interface HMPLInstanceContext {
  request: HMPLRequestContext;
}

/**
 * HMPLRequestInit generation function. Needed to work with context.
 */
type HMPLRequestInitFunction = (
  context: HMPLInstanceContext
) => HMPLRequestInit;

interface HMPLRequestsObject extends HMPLRequestInfo {
  arrId?: number; // Needed to replace the request object with a comment
  el?: Comment; // Optional comment node related to the request
  nodeId?: number; // Optional ID of the node associated with this request
}

/**
 * Statuses based on the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) state, as well as those based on HTTP codes without success.
 */
type HMPLInitalStatus =
  | "pending" // Indicates that a promise is pending
  | "rejected" // Indicates that a promise has been rejected
  | 100 // Continue
  | 101 // Switching Protocols
  | 102 // Processing
  | 103 // Early Hints
  | 300 // Multiple Choices
  | 301 // Moved Permanently
  | 302 // Found (Previously "Moved Temporarily")
  | 303 // See Other
  | 304 // Not Modified
  | 305 // Use Proxy
  | 306 // Switch Proxy (Unused)
  | 307 // Temporary Redirect
  | 308 // Permanent Redirect
  | 400 // Bad Request
  | 401 // Unauthorized
  | 402 // Payment Required
  | 403 // Forbidden
  | 404 // Not Found
  | 405 // Method Not Allowed
  | 406 // Not Acceptable
  | 407 // Proxy Authentication Required
  | 408 // Request Timeout
  | 409 // Conflict
  | 410 // Gone
  | 411 // Length Required
  | 412 // Precondition Failed
  | 413 // Payload Too Large
  | 414 // URI Too Long
  | 415 // Unsupported Media Type
  | 416 // Range Not Satisfiable
  | 417 // Expectation Failed
  | 418 // I'm a teapot (RFC2324)
  | 421 // Misdirected Request
  | 422 // Unprocessable Entity
  | 423 // Locked
  | 424 // Failed Dependency
  | 425 // Too Early
  | 426 // Upgrade Required
  | 428 // Precondition Required
  | 429 // Too Many Requests
  | 431 // Request Header Fields Too Large
  | 451 // Unavailable For Legal Reasons
  | 500 // Internal Server Error
  | 501 // Not Implemented
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504 // Gateway Timeout
  | 505 // HTTP Version Not Supported
  | 506 // Variant Also Negotiates
  | 507 // Insufficient Storage
  | 508 // Loop Detected
  | 510 // Not Extended
  | 511; // Network Authentication Required

/**
 * Sets which trigger the indicator will be shown on
 */
type HMPLIndicatorTrigger = HMPLInitalStatus | "error";

/**
 * Interface for indicator object.
 */
interface HMPLIndicator {
  trigger: HMPLIndicatorTrigger; // The status that triggers this indicator.
  content: string; // The content/message displayed by this indicator.
}

/**
 * An object that defines the properties of a request.
 */
interface HMPLRequestInfo {
  src: string; // The source URL of the request.
  method: string; // The HTTP method used for the request (GET, POST, etc.).
  initId?: string | number; // Optional identifier for initializing this request.
  after?: string; // Optional identifier for actions to perform after this request.
  repeat?: boolean; // Indicates if this request should be repeated.
  memo?: boolean; // Indicates if this request should be memoized.
  indicators?: HMPLIndicator[]; // Array of indicators related to this request.
  autoBody?: boolean | HMPLAutoBodyOptions; // Automatic generation of body for request.
}

/**
 * List of options for the autoBody property.
 */
interface HMPLAutoBodyOptions {
  formData?: boolean; // A Boolean variable depending on which FormData will be generated automatically after the submit event.
}

/**
 * Sets options for the compile function.
 */
interface HMPLCompileOptions {
  memo?: boolean; // Indicates if memoization should be applied during compilation.
  autoBody?: boolean | HMPLAutoBodyOptions; // Automatic generation of body for request.
}

interface HMPLParsedIndicators {
  [key: string]: HTMLTemplateElement; // A dictionary mapping keys to parsed HTML template elements.
}

interface HMPLTemplate {
  requests: HMPLRequestsObject[]; // Array of requests associated with this template.
}

/**
 * Initializes a reference to a specific [HMPLRequestInit](https://hmpl-lang.github.io/types.html#hmplrequestinit) dictionary using id.
 */
interface HMPLIdentificationRequestInit {
  value: HMPLRequestInit | HMPLRequestInitFunction; // The initialization parameters for a specific request.
  id: string | number; // Unique identifier for this initialization reference.
}

interface HMPLNodeObj {
  id: number; // Unique identifier for this node object.
  nodes: null | ChildNode[]; // Child nodes associated with this node object or null if none exist.
  parentNode: null | ParentNode; // Parent node associated with this node object or null if it has no parent.
  comment: Comment; // Comment node associated with this node object.
  memo?: {
    // Optional memoization data related to this node's response.
    response: null | string; // Cached response data or null if not cached.
    isPending?: boolean; // Indicates if a response is still pending.
    nodes?: ChildNode[]; // Cached child nodes or null if not cached.
  };
}

/**
 * Type for the full list of http codes, as well as for [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) states without fulfilled. Used in the [HMPLRequest](https://hmpl-lang.github.io/types.html#hmplrequest) object to indicate the status of the request.
 */
type HMPLRequestStatus =
  | HMPLInitalStatus // Includes initial statuses and HTTP error codes without success.
  | 200 // OK - Request succeeded.
  | 201 // Created - Request succeeded and a resource was created.
  | 202 // Accepted - Request accepted but not yet processed.
  | 203 // Non-Authoritative Information - Returned meta-information from a different source.
  | 204 // No Content - Server successfully processed but returns no content.
  | 205 // Reset Content - Instructs client to reset document view.
  | 206 // Partial Content - Partial data returned due to range header.
  | 207 // Multi-Status - Provides status for multiple independent operations.
  | 208 // Already Reported - Members of a collection have already been enumerated.
  | 226; // IM Used - Server has fulfilled a GET request and is delivering an instance-manipulation result.

interface HMPLRequest {
  response: undefined | Element | null | ChildNode[]; // Response data from the server or undefined/null if not available.
  status?: HMPLRequestStatus; // Status code or state of the current request.
}

/**
 * Return object of template function.
 */
interface HMPLInstance {
  response: undefined | Element | null; // Response element or null if not available.
  status?: HMPLRequestStatus; // Status code or state of the current instance.
  requests?: HMPLRequest[]; // Array of requests associated with this instance.
}

interface HMPLElement {
  el: Element; // DOM element associated with this instance.
  id: number; // Unique identifier for this element instance.
  objNode?: HMPLNodeObj; // Optional reference to an associated node object.
}

interface HMPLData {
  dataObjects: HMPLNodeObj[]; // Array of node objects containing data related to requests.
  els: HMPLElement[]; // Array of elements associated with these requests.
  currentId: number; // Current ID used in processing requests and elements.
}

type HMPLRequestFunction = (
  el: Element, // The DOM element to which this function applies.
  options:
    | HMPLRequestInitFunction
    | HMPLRequestInit
    | HMPLIdentificationRequestInit[], // Options or initialization references for requests.
  templateObject: HMPLInstance, // Template instance associated with these requests.
  data: HMPLData, // Data context containing relevant information about nodes and elements.
  mainEl?: Element, // Optional main element used in processing requests.
  isArray?: boolean, // Indicates if multiple requests are being handled as an array.
  reqObject?: HMPLRequest, // Optional reference to a specific request object being processed.
  isRequests?: boolean, // Indicates if multiple requests are being processed in bulk.
  currentHMPLElement?: HMPLElement, // Optional reference to an element currently being processed.
  event?: Event // The event object received after the event is triggered.
) => void;

type HMPLRenderFunction = (
  requestFunction: HMPLRequestFunction // Function responsible for handling requests during rendering process.
) => (
  options?:
    | HMPLRequestInitFunction
    | HMPLRequestInit
    | HMPLIdentificationRequestInit[] // Options or initialization references passed during rendering process.
) => HMPLInstance;

/**
 * Creates a template function.
 */
type HMPLCompile = (
  template: string, // Template string that defines how data will be rendered into HTML structure.
  options?: HMPLCompileOptions // Options that control how compilation occurs (e.g., memoization).
) => HMPLTemplateFunction;

/**
 * The function returned in response to the compile function. Creates template instances.
 */
type HMPLTemplateFunction = (
  options?:
    | HMPLIdentificationRequestInit[]
    | HMPLRequestInit
    | HMPLRequestInitFunction // Options or initialization references used when creating instances from templates.
) => HMPLInstance;

// Exports
export {
  HMPLRequestInit,
  HMPLRequestInitFunction,
  HMPLInstanceContext,
  HMPLRequestsObject,
  HMPLRequestContext,
  HMPLInitalStatus,
  HMPLIndicatorTrigger,
  HMPLIndicator,
  HMPLRequestInfo,
  HMPLCompileOptions,
  HMPLParsedIndicators,
  HMPLTemplate,
  HMPLIdentificationRequestInit,
  HMPLNodeObj,
  HMPLRequestStatus,
  HMPLRequest,
  HMPLInstance,
  HMPLElement,
  HMPLData,
  HMPLRequestFunction,
  HMPLRenderFunction,
  HMPLCompile,
  HMPLTemplateFunction,
  HMPLAutoBodyOptions
};
