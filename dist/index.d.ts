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

const hmpl = {
  compile,
  stringify,
}

export { compile, stringify };

export default hmpl;

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
