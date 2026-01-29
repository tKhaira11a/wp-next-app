import gql from "graphql-tag";

export const ButtonGridQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        buttonGrid(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            listItemIds
            attributes  
        }
    }
`;
