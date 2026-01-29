import gql from "graphql-tag";

export const MacbookScrollQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        macbookScroll(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            src
            boxTitle
            showGradient
            attributes
        }
    }
`;
