/*
 *  Copyright (C) 2026 Tarik Khairalla (khairalla-code)
 *   https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { Element as DomElement } from "html-react-parser";
import {DOMNode} from "html-dom-parser";
import React from "react";
import {componentFactoryMap} from "@/utils/ComponentFactoryMap";
import { cn } from "@/lib/utils";
import {parseStyleString} from "@/utils/ParsingHelper";
import {contactFormFactoryMap} from "@/utils/ContactFormFactoryMap";

async function renderComponent(type: string, id: string): Promise<JSX.Element | null> {
    let factory = contactFormFactoryMap[type];
    if (!factory) {
        factory = componentFactoryMap[type];
        if(!factory) {
            return null;
        }
    }
    return await factory(id);
}

export async function parseHtmlWithComponents(html: string): Promise<JSX.Element[]> {
    const parser = require("htmlparser2");
    const dom = parser.parseDocument(html);
    return await traverse(dom.children as DOMNode[]);
}

async function traverse(nodes: DOMNode[]): Promise<JSX.Element[]> {
    const result: JSX.Element[] = [];
    for (const node of nodes) {
        if (node.type === "comment" && node.data?.startsWith(" COMPONENT:")) {
            const [type, id] = node.data.replace(" COMPONENT:", "").trim().split(":");
            const component = await renderComponent(type, id);
            result.push(<React.Fragment key={type + id}>{component}</React.Fragment>);
        } else if (node.type === "tag") {

            const children = await traverse((node as DomElement).children as DOMNode[] || []);
            const attribs = { ...node.attribs };
            if (attribs.class) {
                attribs.className = cn(attribs.class);
                delete attribs.class;
            }
            if(attribs.srcset) {
                attribs.srcSet = attribs.srcset;
                delete attribs.srcset;
            }
            if (attribs.style) {
                // @ts-ignore
                attribs.style = parseStyleString(attribs.style);
            }
            result.push(
                React.createElement(
                    (node as DomElement).name,
                    {
                        key: Math.random(),
                        style: parseStyleString(attribs.style ?? ""),
                        ...attribs
                    },
                    node.name === "img"  || node.name === "br"  || node.name === "hr" ? undefined : children
                )
            );
        } else if (node.type === "text") {
            result.push(<React.Fragment key={Math.random()}>{node.data}</React.Fragment>);
        }
    }
    return result;
}
