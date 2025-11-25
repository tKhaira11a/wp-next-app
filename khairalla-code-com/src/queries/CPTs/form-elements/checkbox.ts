import gql from "graphql-tag";

export const CheckboxQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        checkbox(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            label
            attributes
            fieldName
        }
    }
`;