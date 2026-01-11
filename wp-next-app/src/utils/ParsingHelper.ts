/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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