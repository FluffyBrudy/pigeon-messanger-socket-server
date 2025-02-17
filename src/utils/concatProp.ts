export const concatProps = (objsArray: Array<Record<string, any>>, propName: string) => {
    let res = '';
    objsArray.forEach((item) => {
        const value = item[propName] || ''
        res += value + ';'
    })
    return res;
}