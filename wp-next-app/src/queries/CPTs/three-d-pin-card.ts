import gql from "graphql-tag";

export const ThreeDPinCardQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        threeDPinCard(id: $id, idType: DATABASE_ID, asPreview: $preview) {
            header
            subHeader
            linkLabel
            linkUrl
            attributes
        }
    }
`;
