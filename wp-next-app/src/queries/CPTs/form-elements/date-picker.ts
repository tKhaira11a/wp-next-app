import gql from "graphql-tag";

export const DatePickerQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {        
        datePicker(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            fieldName            
        }
    }
`;