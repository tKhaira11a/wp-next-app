import gql from "graphql-tag";

export const CarouselSlideQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        carouselSlide(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            background
            buttonLabel
            label
            attributes
        }
    }
`;
