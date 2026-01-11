import type { Metadata } from "next";
import { print } from "graphql/language/printer";
import {Page} from "@/types/GraphQL API";
import { setSeoData } from "@/utils/seoData";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ContentNode } from "@/gql/graphql";
import { PageQuery } from "@/queries/general/PageQuery";
import { SeoQuery } from "@/queries/general/SeoQuery";
import { parseHtmlWithComponents } from '@/utils/ComponentFactory';
import {prepareHtmlContent} from "@/utils/ParsingHelper";

const notFoundPageWordPressId = process.env.NOT_FOUND_ID;

export async function generateMetadata(): Promise<Metadata> {
  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(SeoQuery),
    { slug: notFoundPageWordPressId, idType: "DATABASE_ID" },
  );

  const metadata = setSeoData({ seo: contentNode.seo });

  return {
    ...metadata,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/404-not-found/`,
    },
  } as Metadata;
}

export default async function NotFound() {
  const { page } = await fetchGraphQL<Page>(print(PageQuery), {
    id: notFoundPageWordPressId,
  });
  if(!page) {
    return;
  }
  const htmlWithPlaceholders = prepareHtmlContent(page.content);
  const content = await parseHtmlWithComponents(htmlWithPlaceholders);

    return (<div className={"mt-35"}>{content}</div>);

}
