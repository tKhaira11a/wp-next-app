import gql from "graphql-tag";

export const TextGenQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        textgenEffekt(id: $id, idType: DATABASE_ID, asPreview: $preview) {            
            duration
            words
            attributes
        }
    }
`;
