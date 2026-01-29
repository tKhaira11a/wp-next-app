import gql from "graphql-tag";

export const TimelineContainerQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        timelineContainer(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            itemIds
            attributes
        }
    }
`;
