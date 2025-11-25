import gql from "graphql-tag";

export const TextRevealCardQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        textRevealCard(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            text
            revealText
            cardTitle
            cardDescription
            attributes
        }
    }
`;
