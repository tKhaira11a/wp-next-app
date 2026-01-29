import gql from "graphql-tag";

export const TracingBeamContainerQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        tracBeamCon(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            itemIds
            attributes
        }
    }
`;
