import gql from "graphql-tag";

export const CarouselQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        carousel(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            slideIds
            initialIndex
            attributes
        }
    }
`;
