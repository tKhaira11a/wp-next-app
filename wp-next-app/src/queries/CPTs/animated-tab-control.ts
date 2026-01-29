import gql from "graphql-tag";

export const AniTabControlQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        animatedTabControl(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            tabIds
            attributes
        }
    }
`;
