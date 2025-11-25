import gql from "graphql-tag";

export const SimpleCarouselSlideQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        simpleCarouselSlide(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            background
        }
    }
`;
