const encodeHtmlEntities = (text: string): string => {
    return text.replace(/[\u00A0-\u9999<>\&]/g, i => '&#'+i.charCodeAt(0)+';')
}

export {
    encodeHtmlEntities
}