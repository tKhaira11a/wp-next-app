import gql from "graphql-tag";

export const ButtonQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        button(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes,
            url,
            label
        }
    }
`;
