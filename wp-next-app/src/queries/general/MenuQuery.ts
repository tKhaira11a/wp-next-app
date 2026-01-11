import gql from "graphql-tag";

export const MenuQuery = gql`
query MenuQuery2 {
      menuItems(where: {location: PRIMARY_MENU}) {
        nodes {
          uri
          label
          childItems {
            nodes {
              uri
              label
              connectedNode {
                node {
                  __typename
                  ... on Post {
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;