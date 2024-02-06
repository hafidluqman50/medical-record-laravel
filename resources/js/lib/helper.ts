const encodeHtmlEntities = (text: string): string => {
    return text.replace(/[\u00A0-\u9999<>\&]/g, i => '&#'+i.charCodeAt(0)+';')
}

const formatRupiah = (number: number|bigint): string => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits:0 }).format(number)
}

export {
    encodeHtmlEntities,
    formatRupiah
}