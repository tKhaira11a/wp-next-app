import gql from "graphql-tag";

export const AnimatedTestimonialQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        animatedTestimonial(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            testimonialList
            attributes
        }
    }
`;
