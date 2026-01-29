import gql from "graphql-tag";

export const CompareQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        compare(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            autoplay
            slidemode
            firstImage
            secondImage
            attributes
        }
    }
`;
