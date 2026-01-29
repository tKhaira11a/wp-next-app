import gql from "graphql-tag";

export const AnimatedTabQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        animatedTab(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            childContent
            childIds
            tabTitle
            tabValue
        }
    }
`;
