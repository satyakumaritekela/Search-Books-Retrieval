export class SearchHeader {
    title: string;
    author: string;

    constructor(response: any) {
        this.title = response.title;
        this.author = response.author;
    }
}
