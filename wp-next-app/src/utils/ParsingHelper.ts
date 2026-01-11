import {decode} from "he";
import React from "react";

function removeCustomTagContent(input: string): string {
    const tagPattern = /\[\$([a-zA-Z]+):(\d+)\/\]/g; // Beispiel: [{ID}:{ComponentName}/]
    let output = input;
    let match;

    while ((match = tagPattern.exec(output)) !== null) {
        const [fullMatch, label, id] = match;
        const startIndex = match.index;
        const endTag = `[/${label}:${id}]`; // Beispiel: [/{ID}:{ComponentName}]
        const endIndex = output.indexOf(endTag, startIndex);

        if (endIndex !== -1) {
            const preservedOpenTag = `[$${label}:${id}]`;

            const afterStart = startIndex + fullMatch.length;
            const afterEnd = endIndex + endTag.length;

            output = output.slice(0, startIndex) + preservedOpenTag + output.slice(afterEnd);

            tagPattern.lastIndex = 0;
        }
    }

    return output;
}


export function prepareHtmlContent(pageContent: string): string {

    const decodetContentNoLineBreaks =  decode(pageContent ?? "").replace(/\n/g, "");
    const decodetContentChildRemoved = removeCustomTagContent(decodetContentNoLineBreaks);
    const htmlWithPlaceholders = decodetContentChildRemoved.replace(
                  /\[\$([^\]]+)\]/g,
        (_, match) => `<!-- COMPONENT:${match} -->`
    );

    return htmlWithPlaceholders;
}

export function parseStyleString(styleStr: string): React.CSSProperties {
    if (typeof styleStr !== 'string') {
        return styleStr;
    }
    return styleStr
        .split(";")
        .filter(Boolean)
        .reduce((acc, rule) => {
            const [key, value] = rule.split(":").map(s => s.trim());
            if (!key || !value) return acc;
            const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            // @ts-ignore
            acc[camelKey] = value;
            return acc;
        }, {} as React.CSSProperties);
}