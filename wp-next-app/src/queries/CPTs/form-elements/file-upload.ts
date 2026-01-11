import gql from "graphql-tag";

export const FileUploadQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        fileUpload(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            label
            subLabel
            attributes
            fieldName
        }
    }
`;