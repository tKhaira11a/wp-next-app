import gql from "graphql-tag";

export const BackgroundBoxesQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        backgroundBoxes(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes,
            childIds,
            childContent
        }
    }
`;
