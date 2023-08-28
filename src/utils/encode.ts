/**
 * ASCII to Unicode (decode Base64 to original data)
 * @param {string} b64
 * @return {string}
 */
export function atou(b64:string) :string{
    return decodeURIComponent(atob(b64));
}

/**
 * Unicode to ASCII (encode data to Base64)
 * @param {string} data
 * @return {string}
 */
export function utoa(data: string):string {
    return btoa(encodeURIComponent(data));
}
