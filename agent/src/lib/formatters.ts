export function formatConnectionDescription(connectionDesc: string) {
    var s = connectionDesc;
    s = s.replace(/{ /g, '\n{\n\t')
            .replace(/, /g, ',\n\t')
            .replace(/<connection.*/s, '')
            .replace(/}/g, '\n}');
    return s;
}
