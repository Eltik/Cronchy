import axios from "axios";
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';

export default class PromiseRequest {
    private url: string;
    private options: Options;

    constructor(url:string, options:Options) {
        this.url = url;
        this.options = options;
    }

    public async request(): Promise<Response> {
        return new Promise((resolve, reject) => {
            try {
                if (this.options.stream) {
                    throw new Error("Use the stream() function instead.");
                } else {
                    const options = {
                        ...this.options,
                    };

                    axios(this.url, options).then(async(response) => {
                        const request:Request = {
                            url: this.url,
                            options: this.options
                        };

                        let redirectUrl = this.url;
                        try {
                            redirectUrl = new URL(response.request.responseURL).href;
                        } catch {
                            redirectUrl = this.url;
                        }

                        const text = response.data;
                        let json = response.data;
                        try {
                            json = JSON.parse(response.data);
                        } catch {
                            json = response.data;
                        }

                        const stringified = `Status: ${response.status} ${response.statusText}\nURL: ${this.url}\nHeaders: ${JSON.stringify(response.headers)}\nBody: ${JSON.stringify(text)}`;
        
                        const res:Response = {
                            request,
                            status: response.status,
                            statusText: response.statusText,
                            url: redirectUrl,
                            error: [],
                            headers: response.headers,
                            toString: () => stringified,
                            raw: () => response,
                            text: () => text,
                            json: () => json
                        };
        
                        resolve(res);
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            } catch {
                console.error("Unable to send request.");
            }
        });
    }

    public async stream(stream) {
        return new Promise((resolve, reject) => {
            try {
                axios(this.url, {
                    ...this.options,
                    responseType: "stream"
                }).then((response) => {
                    if (response.statusText != "OK") console.error(`unexpected response ${response.statusText}`);
                    const streamPipeline = promisify(pipeline);
                    streamPipeline(response.data, stream).then(() => {
                        resolve(true);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } catch {
                console.error("Error with streaming.");
            }
        })
    }
}

type Options = {
    method?: string;
    headers?: { [key: string]: string };
    data?: string|URLSearchParams;
    maxRedirects?: number;
    stream?: boolean;
};

interface Response {
    request: Request;
    status: number;
    statusText: string;
    url: string;
    error: string[];
    headers: { [key: string]: string }|Headers;
    toString: ()=>string;
    raw: ()=>any;
    text: ()=>string;
    json: ()=>any;
};

interface Request {
    url: string;
    options: Options;
};

export type { Options, Response, Request };