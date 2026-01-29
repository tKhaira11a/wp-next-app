import gql from "graphql-tag";

export const ParticalCanvasQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        particalCanvas(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            density,
            particleColor,
            speed,
            background,
            interactive,
            childIds,
            childContent,
            attributes
        }
    }
`;
