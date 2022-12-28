"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class Cronchy {
    /**
     * @param email The email of the account.
     * @param password Password of the account.
     * @param token Optional token. If it has changed, you can pass it in.
     */
    constructor(email, password, token) {
        // Constant, might need to be changed.
        this.token = "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=";
        this.email = email;
        this.password = password;
        this.token = token ? token : "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=";
        this.main = "https://www.crunchyroll.com";
        this.api = "https://beta-api.crunchyroll.com";
    }
    /**
     * @important Must be run before any other function.
    */
    async login() {
        const response = await axios_1.default.post(`${this.api}/auth/v1/token`, {
            username: this.email,
            password: this.password,
            grant_type: "password",
            scope: "offline_access"
        }, {
            headers: {
                Authorization: `Basic ${this.token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/auth/v1/token failed.\nEmail: ${this.email}; Password: ${this.password}; Token: ${this.token}`);
        });
        const data = {
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
        const signature = await axios_1.default.get(`${this.api}/index/v2`, {
            headers: {
                Authorization: "Bearer " + data.access_token,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/index/v2 failed.\nBearer: ${data.access_token}`);
        });
        const sig_data = {
            signature: signature.data ? signature.data.cms.signature : "",
            key_pair_id: signature.data ? signature.data.cms.key_pair_id : "",
            bucket: signature.data ? signature.data.cms.bucket : "",
            policy: signature.data ? signature.data.cms.policy : "",
        };
        this.signature = sig_data.signature;
        this.key_pair_id = sig_data.key_pair_id;
        this.bucket = sig_data.bucket;
        this.policy = sig_data.policy;
        return {
            access_token: data.access_token,
            expires_in: data.expires_in,
            token_type: data.token_type,
            scope: data.scope,
            country: data.country,
            account_id: data.account_id,
            signature: sig_data.signature,
            key_pair_id: sig_data.key_pair_id,
            bucket: sig_data.bucket,
            policy: sig_data.policy,
        };
    }
    /**
     * @param query Search query. Takes a string.
     * @param amount Max amount of search results. Takes a number.
    */
    async search(query, amount) {
        const request = await axios_1.default.get(`${this.api}/content/v2/discover/search?q=${encodeURIComponent(query)}&n=${amount}&type=&locale=en-US`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main
            }
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/content/v2/discover/search?q=${encodeURIComponent(query)}&n=${amount}&type=&locale=en-US failed.\nBearer: ${this.accessToken}; Referer: ${this.main}`);
        });
        return request.data;
    }
    async queryShowData(id, locale, mediaType) {
        const cr_data = await axios_1.default.get(`${this.api}/content/v2/cms/${mediaType}/${id}?locale=${locale}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main
            }
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/content/v2/cms/${mediaType}/${id}?locale=${locale} failed.\nBearer: ${this.accessToken}; Referer: ${this.main}`);
        });
        return cr_data["data"];
    }
    async queryGenreData(id, locale) {
        const cr_genre_response = await axios_1.default.get(`${this.api}/content/v1/tenant_categories?guid=${id}?locale=${locale}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        return cr_genre_response["data"];
    }
    async queryRatings(id) {
        const cr_ratings_response = await axios_1.default.get(`${this.api}/content-reviews/v2/user/${this.accountId}/rating/series/${id}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/content-reviews/v2/user/${this.accountId}/rating/series/${id} failed.\nBearer: ${this.accessToken}`);
        });
        return cr_ratings_response["data"];
    }
    async queryRecommendations(id, locale) {
        const cr_recommendations_response = await axios_1.default.get(`${this.api}/content/v1/${this.accountId}/similar_to?guid=${id}&locale=${locale}&n=30`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/content/v1/${this.accountId}/similar_to?guid=${id}&locale=${locale}&n=30 failed.\nBearer: ${this.accessToken}`);
        });
        return cr_recommendations_response["data"];
    }
    async querySeason(id, locale) {
        const season_response = await axios_1.default.get(`${this.api}/cms/v2${this.bucket}/seasons?series_id=${id}&locale=${locale}&Signature=${this.signature}&Policy=${this.policy}&Key-Pair-Id=${this.key_pair_id}`, {
            headers: {
                Authorization: "Bearer " + this.accessToken,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/cms/v2${this.bucket}/seasons?series_id=${id}&locale=${locale}&Signature=${this.signature}&Policy=${this.policy}&Key-Pair-Id=${this.key_pair_id} failed.\nBearer: ${this.accessToken}`);
        });
        return season_response["data"];
    }
    async queryEpisodes(season, locale) {
        const episode_response = await axios_1.default.get(`${this.api}/cms/v2${this.bucket}/episodes?season_id=${season.id}&locale=${locale}&Signature=${this.signature}&Policy=${this.policy}&Key-Pair-Id=${this.key_pair_id}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/cms/v2${this.bucket}/episodes?season_id=${season.id}&locale=${locale}&Signature=${this.signature}&Policy=${this.policy}&Key-Pair-Id=${this.key_pair_id} failed.\nBearer: ${this.accessToken}; Referer: ${this.main}`);
        });
        return episode_response["data"];
    }
    /**
     * @param seriesQuery SearchQuery object. Can be obtained from the search function.
     * @param mediaType The type of media. Must be a valid Crunchyroll series string.
     * @param fetchAll Whether or not to fetch all "seasons" (whatever Crunchyroll means by that lol). If false, only the the episodes from the "season" will be fetched.
    */
    async getEpisodes(seriesQuery, mediaType, fetchAll) {
        const id = seriesQuery.id;
        const locale = seriesQuery.series_metadata["subtitle_locales"].length > 0 ? seriesQuery.series_metadata["subtitle_locales"][0] : seriesQuery.series_metadata["audio_locales"][0];
        const cr_data = await this.queryShowData(id, locale, mediaType);
        const cr_genre_response = await this.queryGenreData(id, locale);
        const cr_ratings_data = await this.queryRatings(id);
        const cr_recommendations_data = await (await this.queryRecommendations(id, locale)).items;
        const season_response = await this.querySeason(id, locale);
        const cr_genre_data = cr_genre_response.items;
        const genres = [];
        cr_genre_data.forEach((genre) => {
            genres.push(genre.localization.title);
        });
        const season_data = season_response.items;
        let season_list = [];
        season_data.forEach((season) => {
            season_list.push({
                id: season.id,
                title: season.title,
                season_number: season.season_number,
                type: season.is_dubbed
                    ? season.title.split("(")[1].replace(")", "")
                    : "subbed",
                isDub: season.is_dubbed,
            });
        });
        const episodes = [];
        if (fetchAll) {
            season_list.map((async (season) => {
                const episode_response = await this.queryEpisodes(season, locale);
                const episode_data = await episode_response.items;
                const season_episode_list = {
                    [season.type]: [
                        await episode_data.map((episode) => {
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
                                duration: episode.duration,
                            };
                        }),
                    ],
                };
                return season_episode_list;
            }));
        }
        else {
            const season = season_list[0];
            const episode_response = await this.queryEpisodes(season, locale);
            const episode_data = await episode_response.items;
            await episode_data.map((episode) => {
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
                    duration: episode.duration,
                };
            });
        }
        const returnData = {
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
            recommendations: cr_recommendations_data.map((rec) => {
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
                    hasSub: rec.is_subbed,
                };
            }),
            episodes: episodes,
        };
        return returnData;
    }
    /**
     * @param episodeId The episode ID of the show.
     * @param locale The locale of the episode. For example, "en-US".
    */
    async getSources(episodeId, locale) {
        const temp_response = await axios_1.default.get(`${this.api}/content/v2/cms/objects/${episodeId}?locale=${locale}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}/content/v2/cms/objects/${episodeId}?locale=${locale} failed.\nBearer: ${this.accessToken}; Referer: ${this.main}`);
        });
        const temp_data = await temp_response.data.data[0];
        const episode_response = await axios_1.default.get(`${this.api}${temp_data.streams_link}?locale=${locale}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main,
            },
        }).catch((err) => {
            throw new Error(`Request to ${this.api}${temp_data.streams_link}?locale=${locale} failed.\nBearer: ${this.accessToken}; Referer: ${this.main}`);
        });
        const episode_data = await episode_response.data;
        const sources = [];
        const m3u8Urls = await axios_1.default.get(episode_data.data[0].vo_adaptive_hls[""].url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
                Referer: this.main,
            },
        }).catch((err) => {
            throw new Error(`Request to ${episode_data.data[0].vo_adaptive_hls[""].url}; User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"; Referer: ${this.main}`);
        });
        const videoList = m3u8Urls.data.split("#EXT-X-STREAM-INF:");
        for (const video of videoList ?? []) {
            if (!video.includes("m3u8"))
                continue;
            const url = video.split("\n")[1];
            const quality = video.split("RESOLUTION=")[1].split(",")[0].split("x")[1];
            sources.push({
                url: url,
                quality: `${quality}p`,
                isM3U8: true,
            });
        }
        sources.push({
            quality: "auto",
            url: episode_data.data[0].vo_adaptive_hls[""].url,
            isM3U8: true,
        });
        let subtitles = [];
        for (var key of Object.keys(episode_data.meta.subtitles)) {
            subtitles.push({
                url: episode_data.meta.subtitles[key].url,
                lang: key,
                format: episode_data.meta.subtitles[key].format,
            });
        }
        return {
            sources: sources,
            subtitles: subtitles,
        };
    }
}
exports.default = Cronchy;
//# sourceMappingURL=Cronchy.js.map