import gql from "graphql-tag";

export const ListItemQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        listItem(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            url
            label
        }
    }
`;
