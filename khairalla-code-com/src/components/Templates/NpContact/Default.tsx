import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import {TemplateProps} from "@/types/content";
import { NpContactForm} from "@/types/GraphQL API";
import React from "react";
import {prepareHtmlContent} from "@/utils/ParsingHelper";
import {parseHtmlWithComponents} from "@/utils/ComponentFactory";
import {NpContactFormQuery} from "@/queries/general/NpContactformQuery";

export default async function NpContactform({ node }: TemplateProps) {
    const { npContactForm } = await fetchGraphQL<NpContactForm>(print(NpContactFormQuery), {
        id: node.databaseId,
    });
    if(!npContactForm ) {
        return;
    }
    const htmlWithPlaceholders = prepareHtmlContent(npContactForm.content);
    const content = await parseHtmlWithComponents(htmlWithPlaceholders);
    const emailTemplate = prepareHtmlContent(npContactForm.message);

    return (
        <div className={"mt-35"}>
            {content}
        </div>
    )
}