import gql from "graphql-tag";

export const TimelineItemQuery = gql`
    query PageQuery($id: ID!, $preview: Boolean = false) {
        timelineItem(id:$id, idType: DATABASE_ID, asPreview: $preview) {
            childContent
            itemTitle
            childIds            
            attributes
        }
    }
`;
