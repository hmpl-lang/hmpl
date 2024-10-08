import { compile, stringify } from "../build/main";

import {
  HMPLRequestInit,
  HMPLInstance,
  HMPLRequest,
  HMPLRequestGet,
  HMPLHeadersInit,
  HMPLIdentificationRequestInit,
  HMPLCompile,
  HMPLTemplateFunction,
  HMPLRequestInfo,
  HMPLIndicator,
  HMPLIndicatorTrigger,
  HMPLRequestStatus,
  HMPLCompileOptions
} from "../build/types";

export { compile, stringify };

export default {
  compile,
  stringify,
};

export type {
  HMPLRequestInit,
  HMPLInstance,
  HMPLRequest,
  HMPLRequestGet,
  HMPLHeadersInit,
  HMPLIdentificationRequestInit,
  HMPLCompile,
  HMPLTemplateFunction,
  HMPLRequestInfo,
  HMPLIndicator,
  HMPLIndicatorTrigger,
  HMPLRequestStatus,
  HMPLCompileOptions
};
