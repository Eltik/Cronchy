import CloudScraper, { Response } from "cfbypass";
import axios from "axios";
import { load } from "cheerio";
import { readFileSync } from "fs";
import { join } from "path";
import jsdomGlobal = require("./jsdom-global");
import { randomUUID } from "crypto";

class Cronchy {
    // Constant, might need to be changed.
    private token:string = "eyJhbGciOiJSUzI1NiIsImtpZCI6InY4Wl9yZmwySUFpNkVZN2w0VDd5UkEiLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiIiLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjEiLCJjcl9wcmVtaXVtIiwibWFuZ2FfbGlicmFyeSIsIm5vX2FkcyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9iYWNrZW5kIiwiY2xpZW50X3RhZyI6IjEuMC4wIGJldGEiLCJjb3VudHJ5IjoiVVMiLCJldHBfdXNlcl9pZCI6IjA2OWQ3NzdlLWFkYjgtNTM5My04N2Y4LTc2Zjg3OTk5NzgyMyIsImV4cCI6MTY3MTc0ODAxMiwianRpIjoiMjllZTBlYmEtYjQ0MC00NTU5LWExYTYtNzlkYmE0NjVmNzgwIiwibWF0dXJpdHkiOiJNMiIsIm9hdXRoX3Njb3BlcyI6ImFjY291bnQgY29udGVudCBvZmZsaW5lX2FjY2VzcyIsInJ0X2lkIjoiY2VmcW5tdHZrOXFkc3JrMW01OTAiLCJzY29wZXMiOnsiY3IiOnsiYWNjX2lkIjoiMDY5ZDc3N2UtYWRiOC01MzkzLTg3ZjgtNzZmODc5OTk3ODIzIiwiZXh0X2lkIjoiODk0MjIyNjIifX0sInN0YXR1cyI6IkFDVElWRSIsInRudCI6ImNyIn0.C3my3oEpk5XHgnAfKNd6o-BwhUlmkQ9StQ3t8bkXH2yvK27giy2xAynG3jwTxaVabCMiHar1WMxpaXWou08_DAGZ8SXYFbv4jCP4Ck8ip_fxzCYgmbbCeeeEPN7Kpf5OKv6pjnKFPYXXxiMf2W0W7eaPwPRzASUkEg5uSpordAvVG0aSbR0a9oHQAPprqyjPyY_fId3kuhWqlSfFe31T8f0yiZJTKCtI3v1JYBjtW_WrgJcqAkqDZbAKiMlT9EshGgR0tN12HkV1qy53_c-hU8aXWadJ-_4fXbtxjVyd45m4p2s7o3H2iq2TERrqGleO1sWQr5zJG9g3d43MatU3IA";
    private email:string;
    private password:string;
    private accountToken:string;

    private isPython3:boolean;

    private cf:CloudScraper;

    // If you are using Python 3, set this to true
    // For the token, it might change. You can pass it in if it has changed.
    constructor(email:string, password:string, isPython3?:boolean, token?:string) {
        this.email = email;
        this.password = password;
        this.isPython3 = isPython3 ?? false;
        this.token = token ? token : "eyJhbGciOiJSUzI1NiIsImtpZCI6InY4Wl9yZmwySUFpNkVZN2w0VDd5UkEiLCJ0eXAiOiJKV1QifQ.eyJhbm9ueW1vdXNfaWQiOiIiLCJiZW5lZml0cyI6WyJjYXRhbG9nIiwiY29uY3VycmVudF9zdHJlYW1zLjEiLCJjcl9wcmVtaXVtIiwibWFuZ2FfbGlicmFyeSIsIm5vX2FkcyIsInNpbXVsY2FzdCJdLCJjbGllbnRfaWQiOiJjcl9iYWNrZW5kIiwiY2xpZW50X3RhZyI6IjEuMC4wIGJldGEiLCJjb3VudHJ5IjoiVVMiLCJldHBfdXNlcl9pZCI6IjA2OWQ3NzdlLWFkYjgtNTM5My04N2Y4LTc2Zjg3OTk5NzgyMyIsImV4cCI6MTY3MTc0ODAxMiwianRpIjoiMjllZTBlYmEtYjQ0MC00NTU5LWExYTYtNzlkYmE0NjVmNzgwIiwibWF0dXJpdHkiOiJNMiIsIm9hdXRoX3Njb3BlcyI6ImFjY291bnQgY29udGVudCBvZmZsaW5lX2FjY2VzcyIsInJ0X2lkIjoiY2VmcW5tdHZrOXFkc3JrMW01OTAiLCJzY29wZXMiOnsiY3IiOnsiYWNjX2lkIjoiMDY5ZDc3N2UtYWRiOC01MzkzLTg3ZjgtNzZmODc5OTk3ODIzIiwiZXh0X2lkIjoiODk0MjIyNjIifX0sInN0YXR1cyI6IkFDVElWRSIsInRudCI6ImNyIn0.C3my3oEpk5XHgnAfKNd6o-BwhUlmkQ9StQ3t8bkXH2yvK27giy2xAynG3jwTxaVabCMiHar1WMxpaXWou08_DAGZ8SXYFbv4jCP4Ck8ip_fxzCYgmbbCeeeEPN7Kpf5OKv6pjnKFPYXXxiMf2W0W7eaPwPRzASUkEg5uSpordAvVG0aSbR0a9oHQAPprqyjPyY_fId3kuhWqlSfFe31T8f0yiZJTKCtI3v1JYBjtW_WrgJcqAkqDZbAKiMlT9EshGgR0tN12HkV1qy53_c-hU8aXWadJ-_4fXbtxjVyd45m4p2s7o3H2iq2TERrqGleO1sWQr5zJG9g3d43MatU3IA";

        this.cf = new CloudScraper(this.isPython3);
        
        this.login = this.login.bind(this);
        this.getLoginData = this.getLoginData.bind(this);
    }

    public async login(): Promise<String> {
        const loginData = await this.getLoginData();
        console.log(loginData.headers)
        const response = await this.cf.post("https://beta-api.crunchyroll.com/auth/v1/token", {
            body: loginData.body,
            headers: loginData.headers
        });
        console.log(response.text());
        return "";
    }

    public async getLoginData(): Promise<LoginData> {
        const cf = await this.cf.get("https://www.crunchyroll.com/login", { allowRedirect: true });
        const $ = load(cf.text());
        
        const authId = new URL(cf.url).searchParams.get("authid");
        
        const csrf = $("input[name='csrf_token']").attr("value");

        const reCaptcha = await this.cf.solveCaptcha3FromHTML("https://sso.crunchyroll.com/login?authid=" + authId, cf.text(), "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LeQj_wUAAAAABLdMxMxFF-x3Jvyd1hkbsRV9UAk&co=aHR0cHM6Ly9zc28uY3J1bmNoeXJvbGwuY29tOjQ0Mw..&hl=en&v=5qcenVbrhOy8zihcc2aHOWD4&size=invisible&cb=mdp5wyey7wj2");

        const aid = readFileSync(join(__dirname, "./html/aid_extractor.html"), "utf-8");

        const jsdom = jsdomGlobal.default(aid, { runScripts: "dangerously" });
        const dom = jsdom.dom;
        const anonymousId = dom.window.analytics.user().anonymousId();
        jsdom.cleanup();

        const response = await this.cf.post(`https://sso.crunchyroll.com/login?authid=${authId}`, {
            body: `username=${this.email}&password=${this.password}&csrf_token=${csrf}&anonymous_id=${anonymousId}&recaptcha_token=${reCaptcha}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                "content-type": "application/x-www-form-urlencoded",
                cookie: `ajs_anonymous_id="${anonymousId}"`,
                "Accept-Encoding": "gzip,deflate,compress"
            },
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
        const $$ = load(response.text());
        const error = $$("div.cx-flash-message__error div.cx-flash-message__text").text().trim();

        if (error.length > 0) {
            throw new Error(error);
        }

        // https://www.geekstrick.com/snippets/how-to-parse-cookies-in-javascript/
        const parseCookie = str =>
            str.split(';').map(v => v.split('=')).reduce((acc, v) => {
                v = v[1] ? v : [v[0], "Unknown"];
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
        const parsedCookies = parseCookie(response.headers["Set-Cookie"]);

        const headers = {
            authorization: `Basic ${this.token}`,
            referer: "https://www.crunchyroll.com/",
            "content-type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            cookie: `etp_rt: ${parsedCookies["etp_rt"]}`
        };

        const body = "device_id=cb2e1c03-f89d-42bf-9b48-b12b4b3030f3&device_type=Chrome%20on%20macOS&grant_type=etp_rt_cookie";

        return { response: response, authId: authId, csrf: csrf, anonymousId: anonymousId, reCaptcha: reCaptcha, headers: headers, body: body };
    }

    // @param isPython3: boolean
    public setPython3(isPython3:boolean) {
        this.isPython3 = isPython3;
        this.cf = new CloudScraper(isPython3);
    }

    // @param isPython3: boolean
    public async install() {
        await this.cf.install();
    }
}

type LoginData = {
    response: Response,
    authId: string,
    csrf: string,
    anonymousId: string,
    reCaptcha: string,
    body: any,
    headers: any
}

export default Cronchy;
export type { LoginData };