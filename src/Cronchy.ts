import axios from "axios";

class Cronchy {
    // Constant, might need to be changed.
    public token:string = "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=";
    
    public email:string;
    public password:string;

    public accessToken:string;
    public refreshToken:string;
    private accountId:string;
    private bucket:string;
    private signature:string
    private policy:string;
    private key_pair_id: string;

    private main:string;
    private api:string;

    // If you are using Python 3, set this to true
    // For the token, it might change. You can pass it in if it has changed.
    constructor(email:string, password:string, token?:string) {
        this.email = email;
        this.password = password;
        this.token = token ? token : "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=";

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
    }

    public async login(): Promise<AccountData> {
        const response = await axios.post(`${this.api}/auth/v1/token`,
            {
                username: this.email,
                password: this.password,
                grant_type: "password",
                scope: "offline_access"
            },
            {
            headers: {
                Authorization: `Basic ${this.token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
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

        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token;
        this.accountId = data.account_id;

        const signature = await axios.get(`${this.api}/index/v2`,
            {
                headers: {
                    Authorization: "Bearer " + data.access_token,
                },
            }
        );

        const sig_data = {
            signature: signature.data ? signature.data.cms.signature : "",
            key_pair_id: signature.data ? signature.data.cms.key_pair_id : "",
            bucket: signature.data ? signature.data.cms.bucket : "",
            policy: signature.data ? signature.data.cms.policy : "",
        }

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
        }
    }

    public async search(query:string, amount:number): Promise<SearchData> {
        const request = await axios.get(`${this.api}/content/v2/discover/search?q=${encodeURIComponent(query)}&n=${amount}&type=&locale=en-US`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main
            }
        });
        return request.data;
    }

    public async queryShowData(id:string, locale:string, mediaType:MediaType): Promise<ShowData> {
        const cr_data = await axios.get(`${this.api}/content/v2/cms/${mediaType}/${id}?locale=${locale}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main
            }
        });

        return cr_data["data"];
    }

    public async queryGenreData(id:string, locale:string): Promise<GenreQuery> {
        const cr_genre_response: GenreQuery = await axios.get(
            `https://beta-api.crunchyroll.com/content/v1/tenant_categories?guid=${id}?locale=${locale}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        );

        return cr_genre_response["data"];
    }

    public async queryRatings(id:string): Promise<RatingsQuery> {
        const cr_ratings_response = await axios.get(
            `https://beta-api.crunchyroll.com/content-reviews/v2/user/${this.accountId}/rating/series/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        );
        return cr_ratings_response["data"];
    }

    public async queryRecommendations(id:string, locale:string): Promise<RecommendationsQuery> {
        const cr_recommendations_response = await axios.get(
            `https://beta-api.crunchyroll.com/content/v1/${this.accountId}/similar_to?guid=${id}&locale=${locale}&n=30`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        );
        return cr_recommendations_response["data"];
    }

    public async querySeason(id:string, locale:string): Promise<SeasonQuery> {
        const season_response = await axios.get(
            `https://beta-api.crunchyroll.com/cms/v2${this.bucket}/seasons?series_id=${id}&locale=${locale}&Signature=${this.signature}&Policy=${this.policy}&Key-Pair-Id=${this.key_pair_id}`,
            {
                headers: {
                    Authorization: "Bearer " + this.accessToken,
                },
            }
        );
        return season_response["data"];
    }

    public async queryEpisodes(season:SeasonInfo, locale:string): Promise<EpisodeQuery> {
        const episode_response = await axios.get(
            `https://beta-api.crunchyroll.com/cms/v2${this.bucket}/episodes?season_id=${season.id}&locale=${locale}&Signature=${this.signature}&Policy=${this.policy}&Key-Pair-Id=${this.key_pair_id}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    Referer: this.main,
                },
            }
        );
        return episode_response["data"];
    }

    public async getEpisodes(seriesQuery:SearchQuery, mediaType:MediaType, fetchAll: boolean) {
        // https://www.crunchyroll.com/content/v2/cms/series/GXJHM39MP?locale=en-US
        const id = seriesQuery.id;
        const locale = seriesQuery.series_metadata["subtitle_locales"].length > 0 ? seriesQuery.series_metadata["subtitle_locales"][0] : seriesQuery.series_metadata["audio_locales"][0];
        
        const cr_data = await this.queryShowData(id, locale, mediaType);
        const cr_genre_response = await this.queryGenreData(id, locale);
        const cr_ratings_data = await this.queryRatings(id);
        const cr_recommendations_data = await (await this.queryRecommendations(id, locale)).items;
        const season_response = await this.querySeason(id, locale);

        const cr_genre_data = cr_genre_response.items;
        const genres: string[] = [];
        cr_genre_data.forEach((genre: GenreInfo) => {
            genres.push(genre.localization.title);
        });

        const season_data = season_response.items;
        let season_list: any[] = [];
        season_data.forEach((season: SeasonInfo) => {
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

        const episodes: {}[] = [];
        
        if (fetchAll) {
            season_list.map((async(season: SeasonInfo) => {
                const episode_response = await this.queryEpisodes(season, locale);
                const episode_data = await episode_response.items;

                const season_episode_list = {
                    [season.type]: [
                        await episode_data.map((episode: EpisodeInfo) => {
                            return {
                                id: episode.id,
                                season_number: season.season_number,
                                title: episode.title,
                                image:
                                    episode.images.thumbnail[0][
                                    episode.images.thumbnail[0].length - 1
                                    ].source,
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
            }))
        } else {
            const season = season_list[0];
            const episode_response = await this.queryEpisodes(season, locale);
            const episode_data = await episode_response.items;
            await episode_data.map((episode: EpisodeInfo) => {
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
            })
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
            recommendations: cr_recommendations_data.map((rec: RecommendationsInfo) => {
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
}

interface AccountData {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope: string;
    country: string;
    account_id: string;
    signature: string;
    key_pair_id: string;
    bucket: string;
    policy: string;
}

interface SearchData {
    total: number;
    data: Array<JSON>;
    meta: JSON;
}

interface SearchQuery {
    linked_resource_key?: string;
    search_metadata?: JSON;
    title?: string;
    new?: boolean;
    external_id?: string;
    type: MediaType["movie_listing"] | MediaType["objects"] | MediaType["series"] | MediaType["episode"];
    slug_title?: string;
    images?: JSON;
    series_metadata?: JSON;
    id: string;
    description?: string | Array<String>;
    promo_title?: string;
    channel_id?: string;
    promo_description?: string;
    slug?: string;
}

interface ShowData {
    total: number;
    data: Array<ShowInfo>;
    meta: JSON;
}

interface ShowInfo {
    is_subbed: boolean;
    is_dubbed: boolean;
    is_simulcast: boolean;
    is_mature: boolean;
    mature_blocked: boolean;
    id: string;
    title: string;
    slug_title: string;
    description: string;
    content_provider: string;
    seo_title: string;
    availability_notes: string;
    channel_id: string;
    episode_count: number;
    season_count: number;
    series_launch_year: number;
    media_count: number;
    extended_maturity_rating: JSON;
    images: any;
    maturity_ratings: Array<string>;
    audio_locales: Array<string>;
    season_tags: Array<string>;
    keywords: Array<string>;
    subtitle_locales: Array<string>;
}

interface GenreQuery {
    total: number;
    items: Array<GenreInfo>;
    meta: JSON;
}

interface GenreInfo {
    tenant_category: string;
    images: any;
    localization: Localization;
    slug: string;
    __href__: string;
}

interface Localization {
    title: string;
    description: string;
    locale: string;
}

interface RatingsQuery {
    "1s": Rating;
    "2s": Rating;
    "3s": Rating;
    "4s": Rating;
    "5s": Rating;
    average: string;
    total: number;
    rating: string;
}

interface Rating {
    displayed: number;
    unit: any;
    percentage: number;
}

interface RecommendationsQuery {
    total: number;
    items: Array<RecommendationsInfo>;
    __class__: string;
    __href__: string;
    __resource_key__: string;
    __links__: JSON;
}

interface RecommendationsInfo {
    id: string;
    is_subbed: boolean;
    is_dubbed: boolean;
    is_mature: boolean;
    series_launch_year: number;
    type: MediaType["movie_listing"] | MediaType["objects"] | MediaType["series"] | MediaType["episode"];
    title: string;
    slug_title: string;
    promo_title: string;
    description: string;
    promo_description: string;
    new: boolean;
    new_content: boolean;
    slug: string;
    channel_id: string;
    external_id: string;
    linked_resource_key: string;
    series_metadata: JSON;
    images: any;
    search_metadata: JSON;
    __href__: string;
    __class__: string;
    __links__: JSON;
    __actions__: JSON;
}

interface SeasonQuery {
    total: number;
    items: Array<SeasonInfo>;
    __class__: string;
    __href__: string;
    __resource_key__: string;
    __links: JSON;
    __actions__: JSON;
}

interface SeasonInfo {
    id: string;
    type: MediaType["movie_listing"] | MediaType["objects"] | MediaType["series"] | MediaType["episode"];
    series_id: string;
    title: string;
    seo_title: string;
    seo_description: string;
    availability_notes: string;
    slug_title: string;
    description: string;
    channel_id: string;
    season_display_number: string;
    season_sequence_number: number;
    season_number: number;
    is_complete: boolean;
    is_mature: boolean;
    mature_blocked: boolean;
    is_subbed: boolean;
    is_dubbed: boolean;
    is_simulcast: boolean;
    keywords: Array<string>;
    season_tags: Array<string>;
    maturity_ratings: Array<string>;
    audio_locales: Array<string>;
    subtitle_locales: Array<string>;
    audio_locale: string;
    versions: any;
    identifier: string;
    images: any;
    extended_maturity_rating: JSON;
    __class__: string;
    __href__: string;
    __resource_key__: string;
    __links__: JSON;
    __actions__: JSON;
}

interface EpisodeQuery {
    total: number;
    items: Array<EpisodeInfo>;
    __class__: string;
    __href__: string;
    __resource_key__: string;
    __links__: JSON;
    __actions__: JSON;
}

interface EpisodeInfo {
    id: string;
    title: string;
    slug_title: string;
    description: string;
    next_episode_id: string;
    next_episode_title: string;
    hd_flag: boolean;
    maturity_ratings: Array<string>;
    is_mature: boolean;
    mature_blocked: boolean;
    episode_air_date: string;
    upload_date: string;
    availability_starts: string;
    availability_ends: string;
    eligible_region: any;
    available_date: any;
    free_available_date: any;
    premium_date: any;
    premium_available_date: any;
    is_subbed: boolean;
    is_dubbed: boolean;
    is_clip: boolean;
    seo_title: string;
    seo_description: string;
    season_tags: Array<string>;
    playback: string;
    availability_notes: string;
    audio_locale: string;
    versions: any;
    closed_captions_available: boolean;
    identifier: string;
    media_type: MediaType["movie_listing"] | MediaType["objects"] | MediaType["series"] | MediaType["episode"];
    slug: string;
    images: any;
    duration_ms: number;
    is_premium_only: string;
    listing_id: string;
    channel_id: string;
    series_id: string;
    series_title: string;
    series_slug_title: string;
    season_id: string;
    season_title: string;
    season_slug_title: string;
    season_number: number;
    episode: string;
    episode_number: number;
    sequence_number: number;
    production_episode_id: string;
    duration: number;
    __class__: string;
    __href__: string;
    __resource_key__: string;
    __links__: JSON;
    __actions__: JSON;
}

interface MediaType {
    "series"?: string;
    "objects"?: string;
    "movie_listing"?: string;
    "episode"?: string;
}

export default Cronchy;
export type { AccountData, SearchData, SearchQuery, ShowData, ShowInfo, GenreQuery, GenreInfo, Localization, RatingsQuery, Rating, RecommendationsQuery, RecommendationsInfo, SeasonQuery, SeasonInfo, EpisodeQuery, EpisodeInfo, MediaType };