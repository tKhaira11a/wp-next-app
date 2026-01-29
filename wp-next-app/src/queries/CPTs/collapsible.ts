import gql from "graphql-tag";

export const CollapsibleQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        collapsible(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes,
            childContent,
            triggerLabel
        }
    }
`;
