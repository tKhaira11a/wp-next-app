import gql from "graphql-tag";

export const NpFormBlockQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        formBlock(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            selectedValue
            attributes
        }
    }
`;