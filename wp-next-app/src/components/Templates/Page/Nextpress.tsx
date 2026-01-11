import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { TemplateProps } from "@/types/content";
import {PageQuery} from "@/queries/general/PageQuery";
import React from "react";
import { Page } from "@/types/GraphQL API";
import { parseHtmlWithComponents } from '@/utils/ComponentFactory';
import {prepareHtmlContent} from "@/utils/ParsingHelper";

export default async function Nextpress({ node }: TemplateProps) {
    const  page = await fetchGraphQL<Page >(
        print(PageQuery),
        { id: node.databaseId }
    );
    if(!page ) {
        return;
    }
    const htmlWithPlaceholders = prepareHtmlContent(page.page.content);
    const content = await parseHtmlWithComponents(htmlWithPlaceholders);

    return (
        <div className={"mt-35"}>
            {content}
        </div>
    )
}

