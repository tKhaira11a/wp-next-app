import gql from "graphql-tag";

export const LinkPreviewQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        linkPreview(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            url
            label
            attributes
        }
    }
`;
