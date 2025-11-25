import gql from "graphql-tag";

export const TestimonialQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        testimonial(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            quote
            testimonialName
            position
            bild
            attributes
        }
    }
`;
