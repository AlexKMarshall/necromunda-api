"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseUrl = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validate = (variable) => {
    const value = process.env[variable];
    if (!value) {
        throw new Error(`Missing environment variable: ${variable}`);
    }
    return value;
};
exports.port = validate("PORT");
exports.databaseUrl = validate("DATABASE_URI");
//# sourceMappingURL=index.js.map