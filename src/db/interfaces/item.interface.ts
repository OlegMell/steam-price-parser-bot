export interface Item extends Document {
    id?: string,
    name: string,
    link: string,
    prevPrice: string,
    initialPrice: string,
    selectorHTML: string,
    dateTime: Date
}
