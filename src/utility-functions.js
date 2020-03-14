export function resolveNerthusUrl(url) {
    return url.replace(/^#/,FILE_PREFIX)
}
