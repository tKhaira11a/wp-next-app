import gql from "graphql-tag";

export const ContainerScrollAniQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        containerScrollAni(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            attributes,
            childIds,
            childContent,
            background
        }
    }
`;
