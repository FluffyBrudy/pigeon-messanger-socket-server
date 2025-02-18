"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageValidation = exports.idValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const idValidation = (idFieldName) => {
    return joi_1.default.object({
        [idFieldName]: joi_1.default.string().uuid().required(),
    });
};
exports.idValidation = idValidation;
exports.messageValidation = joi_1.default.object({
    creatorId: joi_1.default.string().uuid().required(),
    message: joi_1.default.string().min(1).required(),
    recipientId: joi_1.default.array().items(joi_1.default.string().uuid()).min(1).required(),
});
