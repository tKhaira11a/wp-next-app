import gql from "graphql-tag";

export const TracingBeamItemQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        tracingBeamItem(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            childContent
            itemTitle
            childIds
            attributes
            badge
            image
        }
    }
`;
