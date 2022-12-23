"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var cfbypass_1 = require("cfbypass");
var cheerio_1 = require("cheerio");
var fs_1 = require("fs");
var path_1 = require("path");
var jsdomGlobal = require("./jsdom-global");
var Cronchy = /** @class */ (function () {
    // If you are using Python 3, set this to true
    // For the token, it might change. You can pass it in if it has changed.
    function Cronchy(email, password, isPython3, token) {
        // Constant, might need to be changed.
        this.token = "eyJhbGciOiJSUzI1NiIsImtpZCI6InY4Wl9yZmwySUFpNkVZN2w0VDd5UkEiLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiIiLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjEiLCJjcl9wcmVtaXVtIiwibWFuZ2FfbGlicmFyeSIsIm5vX2FkcyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9iYWNrZW5kIiwiY2xpZW50X3RhZyI6IjEuMC4wIGJldGEiLCJjb3VudHJ5IjoiVVMiLCJldHBfdXNlcl9pZCI6IjA2OWQ3NzdlLWFkYjgtNTM5My04N2Y4LTc2Zjg3OTk5NzgyMyIsImV4cCI6MTY3MTc0ODAxMiwianRpIjoiMjllZTBlYmEtYjQ0MC00NTU5LWExYTYtNzlkYmE0NjVmNzgwIiwibWF0dXJpdHkiOiJNMiIsIm9hdXRoX3Njb3BlcyI6ImFjY291bnQgY29udGVudCBvZmZsaW5lX2FjY2VzcyIsInJ0X2lkIjoiY2VmcW5tdHZrOXFkc3JrMW01OTAiLCJzY29wZXMiOnsiY3IiOnsiYWNjX2lkIjoiMDY5ZDc3N2UtYWRiOC01MzkzLTg3ZjgtNzZmODc5OTk3ODIzIiwiZXh0X2lkIjoiODk0MjIyNjIifX0sInN0YXR1cyI6IkFDVElWRSIsInRudCI6ImNyIn0.C3my3oEpk5XHgnAfKNd6o-BwhUlmkQ9StQ3t8bkXH2yvK27giy2xAynG3jwTxaVabCMiHar1WMxpaXWou08_DAGZ8SXYFbv4jCP4Ck8ip_fxzCYgmbbCeeeEPN7Kpf5OKv6pjnKFPYXXxiMf2W0W7eaPwPRzASUkEg5uSpordAvVG0aSbR0a9oHQAPprqyjPyY_fId3kuhWqlSfFe31T8f0yiZJTKCtI3v1JYBjtW_WrgJcqAkqDZbAKiMlT9EshGgR0tN12HkV1qy53_c-hU8aXWadJ-_4fXbtxjVyd45m4p2s7o3H2iq2TERrqGleO1sWQr5zJG9g3d43MatU3IA";
        this.email = email;
        this.password = password;
        this.isPython3 = isPython3 !== null && isPython3 !== void 0 ? isPython3 : false;
        this.token = token ? token : "eyJhbGciOiJSUzI1NiIsImtpZCI6InY4Wl9yZmwySUFpNkVZN2w0VDd5UkEiLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiIiLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjEiLCJjcl9wcmVtaXVtIiwibWFuZ2FfbGlicmFyeSIsIm5vX2FkcyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9iYWNrZW5kIiwiY2xpZW50X3RhZyI6IjEuMC4wIGJldGEiLCJjb3VudHJ5IjoiVVMiLCJldHBfdXNlcl9pZCI6IjA2OWQ3NzdlLWFkYjgtNTM5My04N2Y4LTc2Zjg3OTk5NzgyMyIsImV4cCI6MTY3MTc0ODAxMiwianRpIjoiMjllZTBlYmEtYjQ0MC00NTU5LWExYTYtNzlkYmE0NjVmNzgwIiwibWF0dXJpdHkiOiJNMiIsIm9hdXRoX3Njb3BlcyI6ImFjY291bnQgY29udGVudCBvZmZsaW5lX2FjY2VzcyIsInJ0X2lkIjoiY2VmcW5tdHZrOXFkc3JrMW01OTAiLCJzY29wZXMiOnsiY3IiOnsiYWNjX2lkIjoiMDY5ZDc3N2UtYWRiOC01MzkzLTg3ZjgtNzZmODc5OTk3ODIzIiwiZXh0X2lkIjoiODk0MjIyNjIifX0sInN0YXR1cyI6IkFDVElWRSIsInRudCI6ImNyIn0.C3my3oEpk5XHgnAfKNd6o-BwhUlmkQ9StQ3t8bkXH2yvK27giy2xAynG3jwTxaVabCMiHar1WMxpaXWou08_DAGZ8SXYFbv4jCP4Ck8ip_fxzCYgmbbCeeeEPN7Kpf5OKv6pjnKFPYXXxiMf2W0W7eaPwPRzASUkEg5uSpordAvVG0aSbR0a9oHQAPprqyjPyY_fId3kuhWqlSfFe31T8f0yiZJTKCtI3v1JYBjtW_WrgJcqAkqDZbAKiMlT9EshGgR0tN12HkV1qy53_c-hU8aXWadJ-_4fXbtxjVyd45m4p2s7o3H2iq2TERrqGleO1sWQr5zJG9g3d43MatU3IA";
        this.cf = new cfbypass_1["default"](this.isPython3);
        this.login = this.login.bind(this);
        this.getLoginData = this.getLoginData.bind(this);
    }
    Cronchy.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loginData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLoginData()];
                    case 1:
                        loginData = _a.sent();
                        console.log(loginData.headers);
                        return [4 /*yield*/, this.cf.post("https://www.crunchyroll.com/auth/v1/token", {
                                body: loginData.body,
                                headers: loginData.headers
                            })];
                    case 2:
                        response = _a.sent();
                        console.log(response.text());
                        return [2 /*return*/, ""];
                }
            });
        });
    };
    Cronchy.prototype.getLoginData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cf, $, authId, csrf, reCaptcha, aid, jsdom, dom, anonymousId, response, $$, error, parseCookie, parsedCookies, headers, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cf.get("https://www.crunchyroll.com/login", { allowRedirect: true })];
                    case 1:
                        cf = _a.sent();
                        $ = (0, cheerio_1.load)(cf.text());
                        authId = new URL(cf.url).searchParams.get("authid");
                        csrf = $("input[name='csrf_token']").attr("value");
                        return [4 /*yield*/, this.cf.solveCaptcha3FromHTML("https://sso.crunchyroll.com/login?authid=" + authId, cf.text(), "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LeQj_wUAAAAABLdMxMxFF-x3Jvyd1hkbsRV9UAk&co=aHR0cHM6Ly9zc28uY3J1bmNoeXJvbGwuY29tOjQ0Mw..&hl=en&v=5qcenVbrhOy8zihcc2aHOWD4&size=invisible&cb=mdp5wyey7wj2")];
                    case 2:
                        reCaptcha = _a.sent();
                        aid = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./html/aid_extractor.html"), "utf-8");
                        jsdom = jsdomGlobal["default"](aid, { runScripts: "dangerously" });
                        dom = jsdom.dom;
                        anonymousId = dom.window.analytics.user().anonymousId();
                        jsdom.cleanup();
                        return [4 /*yield*/, this.cf.post("https://sso.crunchyroll.com/login?authid=".concat(authId), {
                                body: "username=".concat(this.email, "&password=").concat(this.password, "&csrf_token=").concat(csrf, "&anonymous_id=").concat(anonymousId, "&recaptcha_token=").concat(reCaptcha),
                                headers: {
                                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                                    "content-type": "application/x-www-form-urlencoded",
                                    cookie: "ajs_anonymous_id=\"".concat(anonymousId, "\""),
                                    "Accept-Encoding": "gzip,deflate,compress"
                                }
                            })
                            /*
                            const response = await axios.post(`https://cors.proxy.consumet.org/https://sso.crunchyroll.com/login?authid=${authId}`, {
                                username: this.email,
                                password: this.password,
                                csrf_token: csrf,
                                anonymous_id: anonymousId,
                                recaptcha_token: reCaptcha
                            }, {
                                headers: {
                                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                                    "content-type": "application/x-www-form-urlencoded",
                                    cookie: `ajs_anonymous_id="${anonymousId}"`,
                                    "Accept-Encoding": "gzip,deflate,compress"
                                }
                            });
                            */
                        ];
                    case 3:
                        response = _a.sent();
                        $$ = (0, cheerio_1.load)(response.text());
                        error = $$("div.cx-flash-message__error div.cx-flash-message__text").text().trim();
                        if (error.length > 0) {
                            throw new Error(error);
                        }
                        parseCookie = function (str) {
                            return str.split(';').map(function (v) { return v.split('='); }).reduce(function (acc, v) {
                                v = v[1] ? v : [v[0], "Unknown"];
                                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                                return acc;
                            }, {});
                        };
                        parsedCookies = parseCookie(response.headers["Set-Cookie"]);
                        headers = {
                            authorization: "Basic ".concat(this.token),
                            referer: "https://www.crunchyroll.com/",
                            "content-type": "application/x-www-form-urlencoded",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                            cookie: "etp_rt: ".concat(parsedCookies["etp_rt"])
                        };
                        body = "device_id=cb2e1c03-f89d-42bf-9b48-b12b4b3030f3&device_type=Chrome%20on%20macOS&grant_type=etp_rt_cookie";
                        return [2 /*return*/, { response: response, authId: authId, csrf: csrf, anonymousId: anonymousId, reCaptcha: reCaptcha, headers: headers, body: body }];
                }
            });
        });
    };
    // @param isPython3: boolean
    Cronchy.prototype.setPython3 = function (isPython3) {
        this.isPython3 = isPython3;
        this.cf = new cfbypass_1["default"](isPython3);
    };
    // @param isPython3: boolean
    Cronchy.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cf.install()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Cronchy;
}());
exports["default"] = Cronchy;
