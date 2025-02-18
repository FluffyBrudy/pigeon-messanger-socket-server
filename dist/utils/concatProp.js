"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatProps = void 0;
const concatProps = (objsArray, propName) => {
    let res = '';
    objsArray.forEach((item) => {
        const value = item[propName] || '';
        res += value + ';';
    });
    return res;
};
exports.concatProps = concatProps;
