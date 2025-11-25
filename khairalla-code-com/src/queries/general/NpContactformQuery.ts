import gql from "graphql-tag";

export const NpContactFormQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        npContactForm(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            content
            from
            to
            subject
            message
            attributes
        }
    }
`;