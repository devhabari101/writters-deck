"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function n({onlyFirst:e=!1}={}){const t=["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)","(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");return new RegExp(t,e?void 0:"g")}const r=n();function o(e){if(typeof e!="string")throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);return e.replace(r,"")}exports.default=o;
//# sourceMappingURL=index-BnIU43YD.js.map