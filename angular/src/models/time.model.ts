export class Time {
    keyword: string;
    time: Date;

    constructor(response: any) {
        this.keyword = response.keyword;
        this.time = response.time;
    }
}
