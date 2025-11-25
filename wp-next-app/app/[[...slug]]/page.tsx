import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { print } from "graphql/language/printer";
import { setSeoData } from "@/utils/seoData";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { nextSlugToWpSlug } from "@/utils/nextSlugToWpSlug";
import { ContentInfoQuery } from "@/queries/general/ContentInfoQuery";
import { SeoQuery } from "@/queries/general/SeoQuery";
import { ContentNode } from "@/gql/graphql";
import PostTemplate from "@/components/Templates/Post/PostTemplate";
import Nextpress from "@/components/Templates/Page/Nextpress";
import Default from "@/components/Templates/Page/Default";
import NpContactform from "@/components/Templates/NpContact/Default";
import NotFound from "@/app/not-found";

type Props = {
  params: Promise<{ slug: string }>;
};
export const revalidate = 0;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = nextSlugToWpSlug((await params).slug);
  const isPreview = slug.includes("preview");

  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(SeoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    },
  );

  if (!contentNode) {
    return notFound();
  }

  const metadata = setSeoData({ seo: contentNode.seo });

  return {
    ...metadata,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${slug}`,
    },
  } as Metadata;
}

export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: Props) {
  const slug = nextSlugToWpSlug((await params).slug);
  const isPreview = slug.includes("preview");
  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(ContentInfoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    },
  );

  if (!contentNode) return NotFound();
  if (!contentNode.template) return NotFound();
  if (!contentNode.template.templateName) return NotFound();


  switch (contentNode.contentTypeName) {
    case "page":
      switch (contentNode.template.templateName) {
        case "Nextpress":
          return <Nextpress node={contentNode} />;
        case "Default":
          return <Default node={contentNode} />;
        default:
          return <p>{contentNode.template.templateName} not implemented</p>;
      }
    case "post":
      return <PostTemplate node={contentNode} />;
    case "np_contact_form":
      return <NpContactform node={contentNode} />;
    default:
      return <p>{contentNode.contentTypeName} not implemented</p>;
  }
}
