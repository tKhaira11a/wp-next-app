import gql from "graphql-tag";

export const HeroParallaxQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        parallaxHeroshot(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            productListIds
            attributes
        }
    }
`;
