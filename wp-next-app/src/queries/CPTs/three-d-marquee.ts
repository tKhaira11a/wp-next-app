import gql from "graphql-tag";

export const ThreeDMarqueeQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        threeDMarquee(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            images
            attributes
        }
    }
`;
