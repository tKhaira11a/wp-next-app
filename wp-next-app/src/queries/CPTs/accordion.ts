import gql from "graphql-tag";

export const AccordionQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        accordion(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            accordionItems
            attributes
        }
    }
`;
