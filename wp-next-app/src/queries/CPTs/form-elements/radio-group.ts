import gql from "graphql-tag";

export const RadioGroupQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        radioGroup(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            fieldName
        }
    }
`;