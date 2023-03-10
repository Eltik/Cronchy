# Cronchy
Crunchyroll wrapper using webscraping utilities. Made using Crunchyroll's beta API. Created by [Eltik](https://github.com/Eltik), [Inumaki](https://github.com/5H4D0WILA), and the [Consumet Community](https://discord.gg/consumet).

## Installation
Cronchy is available on NPM via the following command:
```
$ npm install cronchy
```
However, you can also clone the GitHub via `git clone https://github.com/Eltik/Cronchy`. If you are cloning the repository, you can build the project using the following commands:
```
$ npm run install
$ npm run build
```
It is also important to note that Cronchy requires TypeScript and NodeJS to run, so if you have difficulties installing the library make sure to check that your machine supports both.

## Basic Documentation
### Constructor
Cronchy requires a <b>premium account</b> to work properly (and no, we will/cannot support non-premium accounts). To initialize a Cronchy "instance", pass your email and password into the constructor.
```javascript
// ES6
import Cronchy from "cronchy";
// commonjs
const Cronchy = require("cronchy").default;

const instance = new Cronchy("myemail@outlook.com", "password123");
```
There is a third argument you can pass into the constructor which is the token. As of now, Crunchyroll requires a token header for all requests that is constant. The token should work for all accounts, but in the case it doesn't, you can provide a it into the constructor in the case Crunchyroll changes how their API works. Support will not be provided on how to fetch the token, but for peace of mind the argument is there just in case.
```javascript
...
const instance = new Cronchy("myemail@outlook.com", "password123", "a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=");
```

### Logging In
To use <b>all functions of the package</b>, you need to run the `login()` function beforehand. This is important because Crunchyroll requires an `access_token` header for each request. Some other functions such as the `querySeason()` function require other account data such as the `signature` and `policy` of the account. Don't worry, though; this function is completely safe and simulates a real login.
```typescript
const instance = ...;
await instance.login(); // Returns Promise<AccountData>

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
```
For convenience sake, the `login()` function will store all account data in the instance object. This means that if you are running a web server, upon the server's startup you can run the `login()` function to prevent having to continuously fetch the `access_token`. For example:
```javascript
import Fastify from "fastify";
import Cronchy from "cronchy";

const instance = new Cronchy(...);

const fastify = Fastify({
    ...
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    
    instance.login().then((accountData) => {
        console.log(`Listening to ${address}.`);
    });
})
```

### Searching
Searching using the Cronchy package is simple. Just run `instance.search(query, amount?);` to search through all of Crunchyroll for a specific show. `amount` is an optional parameter that by default will input 8 if not specified.
```typescript
const instance = new Cronchy(...);
/**
 * @param query Search query. Takes a string.
 * @param amount Max amount of search results. Takes a number.
 * returns Promise<SearchData>
 */
instance.search("Bocchi the Rock", 5);

interface SearchData {
    total: number;
    data: Array<SearchResult>;
    meta: JSON;
}

interface SearchResult {
    type: MediaType["top_results"] | MediaType["series"] | MediaType["movie_listing"] | MediaType["episode"];
    count: number;
    items: Array<SearchQuery>;
}
```

### Getting Episodes
Fetchin episodes requires the ID of the show. In past versions of Cronchy you were required to input a `SearchQuery` object. However, I realized that Crunchyroll actually fetches the show info based on the show ID so I removed that parameter. `getEpisodes()` also requires the locale of the show, but most of the time it's just `en-US`. If you need to confirm the locale of the show you are querying, you can run the `getLocaleFromSearchQuery()` function and input a `SearchQuery` object. Lastly, the `mediaType` parameter is the type of the show as the name suggests. You can run the `getMediaTypeFromSearchQuery()` function and input a `SearchQuery` object to fetch it. If either the locale or media type return `undefined`, it most likely means that the show has not been released officially on Crunchyroll (eg. it's not available yet).
```typescript
const instance = new Cronchy(...);
/**
 * @param id SearchQuery id. Can be obtained from the search function.
 * @param locale The locale of the show. Can be obtained from the search function or via getLocaleFromSearchQuery().
 * @param mediaType The type of media. Must be a valid Crunchyroll series string.
 * @param fetchAll Whether or not to fetch all "seasons" (whatever Crunchyroll means by that lol). If false, only the the episodes from the "season" will be fetched.
*/
const results = await instance.search(...);
const locale = instance.getLocaleFromSearchQuery(result.data[0].items[0]);
const mediaType = instance.getMediaTypeFromSearchQuery(result.data[0].items[0]);
await instance.getEpisodes(results.data[0].items[0].id, locale, mediaType, false);

interface Show {
    id: string;
    title: string;
    isAdult: string|boolean;
    image: string;
    cover: string;
    description: string;
    releaseDate: number;
    genres: string[];
    season: string;
    hasDub: boolean;
    hasSub: boolean;
    rating: string;
    recommendations: any; // This needs to be fixed, but it returns data correctly.
    episodes: any; // This to. TypeScript moment :pray:
}
```
To elaborate on the `fetchAll` parameter, fetching all episodes will take longer but also get all the episodes Crunchyroll has. Crunchyroll has "seasons", or multiple "series" of episodes. As a result, the `fetchAll` option is thus required for fetching all episodes as the name suggests.

### Getting Sources
Crunchyroll stores the source of their videos as m3u8s, or streamable files. By default, this package is meant to be lightweight and doesn't contain a convertor. But considering that m3u8s are better for streaming videos rather than mp4s, it makes sense that the `getSources()` function will return an m3u8 instead.
```typescript
const instance = new Cronchy(...);
/**
 * @param episodeId The episode ID of the show.
 * @param locale The locale of the episode. For example, "en-US".
 * returns Promise<Sources>
*/
await instance.getSources("G6Q4Q3V1R", "en-US");

interface Sources {
    sources: Array<Source>;
    subtitles: Array<Subtitle>;
}

interface Source {
    url: string;
    quality: string;
    isM3U8: boolean;
}

interface Subtitle {
    url: string;
    lang: string;
    format: string;
}
```
Contribution to this documentation would be appreciated as it is not finished.

### TODO
- MalSync
- Cleanup (the whole thing is sort of messy)
If anyone wishes to contribute, that would be appreciated. Feel free to create a Pull Request.

<i>Rip Kamyroll</i>