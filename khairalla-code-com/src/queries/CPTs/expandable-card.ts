import gql from "graphql-tag";

export const ExpandableCardQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        expandableCard(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            cardTitle
            description
            cardContent
            ctaText
            ctaLink
            src
            attributes
        }
    }
`;
