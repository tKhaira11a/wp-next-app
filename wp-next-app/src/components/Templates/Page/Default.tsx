import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PageQuery } from "@/queries/general/PageQuery";
import {TemplateProps} from "@/types/content";
import {Page} from "@/types/GraphQL API";

export default async function Default({ node }: TemplateProps) {
    const { page } = await fetchGraphQL<Page>(print(PageQuery), {
        id: node.databaseId,
    });

    return (
        <div className={"mt-35"}>
            <h1 style={{textAlign: "center", fontSize: "2rem"}}>Default Template! No Next.js Rendering!</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content || " " }} />
        </div>
    )
}