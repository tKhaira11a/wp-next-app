import gql from "graphql-tag";

export const SimpleCarouselQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        simpleCarousel(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            slideIds
            attributes
            initialIndex
        }
    }
`;
