import gql from "graphql-tag";

export const ThreeDCardQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        threeDCard(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            cardHeader
            subHeader
            background
            skew
            linkLable            
            linkUrl
            buttonLabel
            buttonUrl
            attributes
        }
    }
`;
