import gql from "graphql-tag";

export const TextareaQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        textarea(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            fieldName
        }
    }
`;