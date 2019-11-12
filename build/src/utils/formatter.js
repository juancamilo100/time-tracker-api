"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnake = (string) => {
    return string.replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + "_" + m[1];
    }).toLowerCase();
};
//# sourceMappingURL=formatter.js.map