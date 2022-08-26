export const helpers = {

    getClearPrice: (price: string): string => price.substring(price.indexOf('$') + 1),

    getNameFromChat: ({ chat }: { chat: any }): string => chat.username || `${ chat.first_name } ${ chat.last_name }`,

    validateLink: (link: string): boolean => {
        const regexPattern = /^(https):\/\/steamcommunity\.com\/market\/[^ "]+$/;
        return link.search(regexPattern) !== -1;
    }
}
