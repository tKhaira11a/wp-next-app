import gql from "graphql-tag";

export const MovingCardsQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        movingCards(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            testimonialList
            attributes
            direction
            speed
            pauseOnHover
        }
    }
`;
