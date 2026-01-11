import {DOMNode} from "html-dom-parser";
import { Element as DomElement } from "html-react-parser";
import React from "react";
import {cn} from "@/lib/utils";
import {parseStyleString} from "@/utils/ParsingHelper";
import {contactFormFactoryMap} from "@/utils/ContactFormFactoryMap";
import {componentFactoryMap} from "@/utils/ComponentFactoryMap";


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

export async function buildForm(html: string): Promise<JSX.Element[]> {
    const parser = require("htmlparser2");
    const dom = parser.parseDocument(html);
    return traverseReactTree(dom.children as DOMNode[]);
}

async function traverseReactTree(nodes: DOMNode[]): Promise<JSX.Element[]>{
    const result: JSX.Element[] = [];
    for (const node of nodes) {
        if (node.type === "comment" && node.data?.startsWith(" COMPONENT:")) {
            const [type, id] = node.data.replace(" COMPONENT:", "").trim().split(":");
            const component = await renderComponent(type, id);
            result.push(<React.Fragment key={type +":"+ id}>{component}</React.Fragment>);
        } else if (node.type === "tag") {

            const children = traverseReactTree((node as DomElement).children as DOMNode[] || []);
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
                    node.name === "img"  || node.name === "br" ? undefined : children
                )
            );
        } else if (node.type === "text") {
            result.push(<React.Fragment key={Math.random()}>{node.data}</React.Fragment>);
        }
    }
    return result;
}