export const helpers = {

    getClearPrice: (price: string): string => price.substring(price.indexOf('$') + 1),

    getNameFromChat: ({ chat }: { chat: any }): string => chat.username || `${ chat.first_name } ${ chat.last_name }`,
}
