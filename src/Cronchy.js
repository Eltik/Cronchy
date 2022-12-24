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
var axios_1 = require("axios");
var cfbypass_1 = require("cfbypass");
var Cronchy = /** @class */ (function () {
    // If you are using Python 3, set this to true
    // For the token, it might change. You can pass it in if it has changed.
    function Cronchy(email, password, isPython3, token) {
        // Constant, might need to be changed.
        this.token = "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=";
        this.email = email;
        this.password = password;
        this.isPython3 = isPython3 !== null && isPython3 !== void 0 ? isPython3 : false;
        this.token = token ? token : "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=";
        this.cf = new cfbypass_1["default"](this.isPython3);
        this.main = "https://www.crunchyroll.com";
        this.api = "https://beta-api.crunchyroll.com";
        this.login = this.login.bind(this);
        this.queryGenreData = this.queryGenreData.bind(this);
        this.queryShowData = this.queryShowData.bind(this);
        this.queryRatings = this.queryRatings.bind(this);
        this.queryRecommendations = this.queryRecommendations.bind(this);
        this.querySeason = this.querySeason.bind(this);
        this.queryEpisodes = this.queryEpisodes.bind(this);
        this.getEpisodes = this.getEpisodes.bind(this);
        this.setPython3 = this.setPython3.bind(this);
        this.install = this.install.bind(this);
    }
    Cronchy.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, signature, sig_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].post("".concat(this.api, "/auth/v1/token"), {
                            username: this.email,
                            password: this.password,
                            grant_type: "password",
                            scope: "offline_access"
                        }, {
                            headers: {
                                Authorization: "Basic ".concat(this.token),
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        data = {
                            access_token: response.data["access_token"],
                            refresh_token: response.data["refresh_token"],
                            expires_in: response.data["expires_in"],
                            token_type: response.data["token_type"],
                            scope: response.data["scope"],
                            country: response.data["country"],
                            account_id: response.data["account_id"]
                        };
                        this.accessToken = data.access_token;
                        this.refreshToken = data.refresh_token;
                        this.accountId = data.account_id;
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.api, "/index/v2"), {
                                headers: {
                                    Authorization: "Bearer " + data.access_token
                                }
                            })];
                    case 2:
                        signature = _a.sent();
                        sig_data = {
                            signature: signature.data ? signature.data.cms.signature : "",
                            key_pair_id: signature.data ? signature.data.cms.key_pair_id : "",
                            bucket: signature.data ? signature.data.cms.bucket : "",
                            policy: signature.data ? signature.data.cms.policy : ""
                        };
                        this.signature = sig_data.signature;
                        this.key_pair_id = sig_data.key_pair_id;
                        this.bucket = sig_data.bucket;
                        this.policy = sig_data.policy;
                        return [2 /*return*/, {
                                access_token: data.access_token,
                                expires_in: data.expires_in,
                                token_type: data.token_type,
                                scope: data.scope,
                                country: data.country,
                                account_id: data.account_id,
                                signature: sig_data.signature,
                                key_pair_id: sig_data.key_pair_id,
                                bucket: sig_data.bucket,
                                policy: sig_data.policy
                            }];
                }
            });
        });
    };
    Cronchy.prototype.search = function (query, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("".concat(this.api, "/content/v2/discover/search?q=").concat(encodeURIComponent(query), "&n=").concat(amount, "&type=&locale=en-US"), {
                            headers: {
                                Authorization: "Bearer ".concat(this.accessToken),
                                Referer: this.main
                            }
                        })];
                    case 1:
                        request = _a.sent();
                        return [2 /*return*/, request.data];
                }
            });
        });
    };
    Cronchy.prototype.queryShowData = function (id, locale, mediaType) {
        return __awaiter(this, void 0, void 0, function () {
            var cr_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("".concat(this.api, "/content/v2/cms/").concat(mediaType, "/").concat(id, "?locale=").concat(locale), {
                            headers: {
                                Authorization: "Bearer ".concat(this.accessToken),
                                Referer: this.main
                            }
                        })];
                    case 1:
                        cr_data = _a.sent();
                        return [2 /*return*/, cr_data["data"]];
                }
            });
        });
    };
    Cronchy.prototype.queryGenreData = function (id, locale) {
        return __awaiter(this, void 0, void 0, function () {
            var cr_genre_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://beta-api.crunchyroll.com/content/v1/tenant_categories?guid=".concat(id, "?locale=").concat(locale), {
                            headers: {
                                Authorization: "Bearer ".concat(this.accessToken)
                            }
                        })];
                    case 1:
                        cr_genre_response = _a.sent();
                        return [2 /*return*/, cr_genre_response["data"]];
                }
            });
        });
    };
    Cronchy.prototype.queryRatings = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cr_ratings_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://beta-api.crunchyroll.com/content-reviews/v2/user/".concat(this.accountId, "/rating/series/").concat(id), {
                            headers: {
                                Authorization: "Bearer ".concat(this.accessToken)
                            }
                        })];
                    case 1:
                        cr_ratings_response = _a.sent();
                        return [2 /*return*/, cr_ratings_response["data"]];
                }
            });
        });
    };
    Cronchy.prototype.queryRecommendations = function (id, locale) {
        return __awaiter(this, void 0, void 0, function () {
            var cr_recommendations_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://beta-api.crunchyroll.com/content/v1/".concat(this.accountId, "/similar_to?guid=").concat(id, "&locale=").concat(locale, "&n=30"), {
                            headers: {
                                Authorization: "Bearer ".concat(this.accessToken)
                            }
                        })];
                    case 1:
                        cr_recommendations_response = _a.sent();
                        return [2 /*return*/, cr_recommendations_response["data"]];
                }
            });
        });
    };
    Cronchy.prototype.querySeason = function (id, locale) {
        return __awaiter(this, void 0, void 0, function () {
            var season_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://beta-api.crunchyroll.com/cms/v2".concat(this.bucket, "/seasons?series_id=").concat(id, "&locale=").concat(locale, "&Signature=").concat(this.signature, "&Policy=").concat(this.policy, "&Key-Pair-Id=").concat(this.key_pair_id), {
                            headers: {
                                Authorization: "Bearer " + this.accessToken
                            }
                        })];
                    case 1:
                        season_response = _a.sent();
                        return [2 /*return*/, season_response["data"]];
                }
            });
        });
    };
    Cronchy.prototype.queryEpisodes = function (season, locale) {
        return __awaiter(this, void 0, void 0, function () {
            var episode_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://beta-api.crunchyroll.com/cms/v2".concat(this.bucket, "/episodes?season_id=").concat(season.id, "&locale=").concat(locale, "&Signature=").concat(this.signature, "&Policy=").concat(this.policy, "&Key-Pair-Id=").concat(this.key_pair_id), {
                            headers: {
                                Authorization: "Bearer ".concat(this.accessToken),
                                Referer: this.main
                            }
                        })];
                    case 1:
                        episode_response = _a.sent();
                        return [2 /*return*/, episode_response["data"]];
                }
            });
        });
    };
    Cronchy.prototype.getEpisodes = function (seriesQuery, mediaType, fetchAll) {
        return __awaiter(this, void 0, void 0, function () {
            var id, locale, cr_data, cr_genre_response, cr_ratings_data, cr_recommendations_data, season_response, cr_genre_data, genres, season_data, season_list, episodes, season_1, episode_response, episode_data, returnData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = seriesQuery.id;
                        locale = seriesQuery.series_metadata["subtitle_locales"].length > 0 ? seriesQuery.series_metadata["subtitle_locales"][0] : seriesQuery.series_metadata["audio_locales"][0];
                        return [4 /*yield*/, this.queryShowData(id, locale, mediaType)];
                    case 1:
                        cr_data = _a.sent();
                        return [4 /*yield*/, this.queryGenreData(id, locale)];
                    case 2:
                        cr_genre_response = _a.sent();
                        return [4 /*yield*/, this.queryRatings(id)];
                    case 3:
                        cr_ratings_data = _a.sent();
                        return [4 /*yield*/, this.queryRecommendations(id, locale)];
                    case 4: return [4 /*yield*/, (_a.sent()).items];
                    case 5:
                        cr_recommendations_data = _a.sent();
                        return [4 /*yield*/, this.querySeason(id, locale)];
                    case 6:
                        season_response = _a.sent();
                        cr_genre_data = cr_genre_response.items;
                        genres = [];
                        cr_genre_data.forEach(function (genre) {
                            genres.push(genre.localization.title);
                        });
                        season_data = season_response.items;
                        season_list = [];
                        season_data.forEach(function (season) {
                            season_list.push({
                                id: season.id,
                                title: season.title,
                                season_number: season.season_number,
                                type: season.is_dubbed
                                    ? season.title.split("(")[1].replace(")", "")
                                    : "subbed",
                                isDub: season.is_dubbed
                            });
                        });
                        episodes = [];
                        if (!fetchAll) return [3 /*break*/, 7];
                        season_list.map((function (season) { return __awaiter(_this, void 0, void 0, function () {
                            var episode_response, episode_data, season_episode_list, _a;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, this.queryEpisodes(season, locale)];
                                    case 1:
                                        episode_response = _c.sent();
                                        return [4 /*yield*/, episode_response.items];
                                    case 2:
                                        episode_data = _c.sent();
                                        _b = {};
                                        _a = season.type;
                                        return [4 /*yield*/, episode_data.map(function (episode) {
                                                return {
                                                    id: episode.id,
                                                    season_number: season.season_number,
                                                    title: episode.title,
                                                    image: episode.images.thumbnail[0][episode.images.thumbnail[0].length - 1].source,
                                                    description: episode.description,
                                                    releaseDate: episode.episode_air_date,
                                                    isHD: episode.hd_flag,
                                                    isAdult: episode.is_mature,
                                                    isDubbed: episode.is_dubbed,
                                                    isSubbed: episode.is_subbed,
                                                    duration: episode.duration
                                                };
                                            })];
                                    case 3:
                                        season_episode_list = (_b[_a] = [
                                            _c.sent()
                                        ],
                                            _b);
                                        return [2 /*return*/, season_episode_list];
                                }
                            });
                        }); }));
                        return [3 /*break*/, 11];
                    case 7:
                        season_1 = season_list[0];
                        return [4 /*yield*/, this.queryEpisodes(season_1, locale)];
                    case 8:
                        episode_response = _a.sent();
                        return [4 /*yield*/, episode_response.items];
                    case 9:
                        episode_data = _a.sent();
                        return [4 /*yield*/, episode_data.map(function (episode) {
                                return {
                                    id: episode.id,
                                    season_number: season_1.season_number,
                                    title: episode.title,
                                    image: episode.images.thumbnail[0][episode.images.thumbnail[0].length - 1].source,
                                    description: episode.description,
                                    releaseDate: episode.episode_air_date,
                                    isHD: episode.hd_flag,
                                    isAdult: episode.is_mature,
                                    isDubbed: episode.is_dubbed,
                                    isSubbed: episode.is_subbed,
                                    duration: episode.duration
                                };
                            })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        console.log(cr_data.data);
                        returnData = {
                            id: id,
                            title: cr_data.data[0].title,
                            isAdult: cr_data.data[0].title,
                            image: cr_data.data[0].images.poster_tall[0][cr_data.data[0].images.poster_tall[0].length - 1].source,
                            cover: cr_data.data[0].images.poster_wide[0][cr_data.data[0].images.poster_wide[0].length - 1].source,
                            description: cr_data.data[0].description,
                            releaseDate: cr_data.data[0].series_launch_year,
                            genres: genres,
                            season: cr_data.data[0].season_tags[0].split("-")[0],
                            hasDub: cr_data.data[0].is_dubbed,
                            hasSub: cr_data.data[0].is_subbed,
                            rating: cr_ratings_data.average,
                            recommendations: cr_recommendations_data.map(function (rec) {
                                return {
                                    id: id,
                                    title: rec.title,
                                    isAdult: rec.is_mature,
                                    image: rec.images.poster_tall[0][rec.images.poster_tall[0].length - 1].source,
                                    popularity: 0,
                                    cover: rec.images.poster_wide[0][rec.images.poster_wide[0].length - 1].source,
                                    description: rec.description,
                                    releaseDate: rec.series_launch_year,
                                    hasDub: rec.is_dubbed,
                                    hasSub: rec.is_subbed
                                };
                            }),
                            episodes: episodes
                        };
                        return [2 /*return*/, returnData];
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
