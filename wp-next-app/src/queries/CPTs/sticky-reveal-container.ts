import gql from "graphql-tag";

export const StickyRevealContainerQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        stickyRevealCon(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            itemIds
            attributes
        }
    }
`;
