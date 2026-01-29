import gql from "graphql-tag";

export const ParallaxGridQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        parallaxGrid(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            images
            attributes
        }
    }
`;
