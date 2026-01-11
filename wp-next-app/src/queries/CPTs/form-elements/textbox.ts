import gql from "graphql-tag";

export const TextboxQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        textbox(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            fieldName
        }
    }
`;