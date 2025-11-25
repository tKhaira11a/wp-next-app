import gql from "graphql-tag";

export const StickyRevealItemQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        stickyRevealItem(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            childContent
            itemTitle
            childIds
            attributes
            description
        }
    }
`;
