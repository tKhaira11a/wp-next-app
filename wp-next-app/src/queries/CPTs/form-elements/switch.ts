import gql from "graphql-tag";

export const SwitchQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        switch(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            attributes
            label
            fieldName
        }
    }
`;