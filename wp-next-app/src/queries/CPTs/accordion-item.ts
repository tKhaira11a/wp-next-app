import gql from "graphql-tag";

export const AccordionItemQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        accordionItem(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            header
            childContent
            attributes
        }
    }
`;
