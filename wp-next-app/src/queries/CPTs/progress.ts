import gql from "graphql-tag";

export const ProgressQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        progress(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes,
            value
        }
    }
`;
