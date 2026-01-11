import gql from "graphql-tag";

export const SelectQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        select(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            fieldName
        }
    }
`;