"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyAuth = () => {
    return (socket, next) => {
        var _a, _b;
        const token = ((_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token) || socket.handshake.query.token;
        if (!token)
            return next(new Error("Auth error: no token provided"));
        try {
            const tokenVerification = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            socket.userId = tokenVerification.id;
            next();
        }
        catch (err) {
            return next(new Error("Auth error:" + err.message));
        }
    };
};
exports.verifyAuth = verifyAuth;
