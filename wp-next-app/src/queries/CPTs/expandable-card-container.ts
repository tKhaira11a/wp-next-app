import gql from "graphql-tag";

export const ExpandableCardContainerQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        expCardContainer(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            listMode
            expandableCards
        }
    }
`;
