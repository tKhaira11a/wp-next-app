import gql from "graphql-tag";

export const HeroParallaxProdQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        heroParallaxProd(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            url
            label
            background
            attributes
        }
    }
`;
