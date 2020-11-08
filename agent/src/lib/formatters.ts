import { IParsingResult } from '../lib/interfaces';

export function formatConnectionDescription(connectionDesc: string) {
    var s = connectionDesc;
    s = s.replace(/{ /g, '\n{\n\t')
            .replace(/, /g, ',\n\t')
            .replace(/<connection.*/s, '')
            .replace(/}/g, '\n}');
    return s;
}

export function formatMessageDescription(messageDesc: string, parsingResult: IParsingResult[]): string {
    var s = messageDesc;
    for (let result of parsingResult) {
        s = s.replace(new RegExp(`(${result.key}.*\n)`), 
                                `$1Parsed ${result.format} data for key '${result.key}': \n${result.data}\n`);
    }

    return s; 
}
