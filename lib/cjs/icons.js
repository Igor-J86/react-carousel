"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowRight = exports.ArrowLeft = void 0;
var react_1 = __importDefault(require("react"));
var defaultWidth = 24;
var defaultColor = "icon-fill";
var ArrowLeft = function (_a) {
    var width = _a.width, color = _a.color;
    return (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 320 512", width: width ? width : defaultWidth, fill: color && color, className: !color ? defaultColor : '' },
        react_1.default.createElement("path", { d: "M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" })));
};
exports.ArrowLeft = ArrowLeft;
var ArrowRight = function (_a) {
    var width = _a.width, color = _a.color;
    return (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 320 512", width: width ? width : defaultWidth, fill: color && color, className: !color ? defaultColor : '' },
        react_1.default.createElement("path", { d: "M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" })));
};
exports.ArrowRight = ArrowRight;
