/**
 * Интервалы времени шедулера расслыки цен по товарам
 */
export enum Intervals {
    HOUR = 3600000,
    MINUTE = 60000,
    HOUR3 = 180 * 60000,
    HOUR6 = 360 * 60000,
}


/**
 * СSS селекторы для парсинга сайта steamcommunity
 */
export enum CSS_SELECTORS {
    ITEM_NAME = 'h1#largeiteminfo_item_name',
    ITEM_PRICE = 'span.market_commodity_orders_header_promote',
}

export enum PARSE_MODE {
    MANUAL = 'manual',
    AUTO = 'auto',
}

export type PARSE_MODE_UNION = `${PARSE_MODE}`;