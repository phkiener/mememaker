export interface Controller {
    init(document: Document): Promise<void>;
}
