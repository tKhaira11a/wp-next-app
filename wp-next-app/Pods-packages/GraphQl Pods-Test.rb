query NextComponents {
  page(id: 296, idType: DATABASE_ID, asPreview: false) {
    id
    title
    content
    nextComponents {
      title
      addAnimatedTestimonials {
        node {
          __typename
          sortedTestimonials {
            bild {
              node {
                filePath
              }
            }
            testimonialName
            quote
            position
          }
          testimonialList {
            nodes {
              __typename
              bild {
                node {
                  filePath
                }
              }
              testimonialName
              quote
              position
            }
          }
        }
      }
      addHeroParallax {
        node {
          __typename
          sortedProducts {
            background {
              node {
                filePath
              }
            }
            uberschrift
            url
          }
          productList {
            nodes {
              __typename
              url
              uberschrift
              background {
                node {
                  filePath
                }
              }
            }
          }
        }
      }
      addParticalCanvas {
        node {
          titel1 {
            node {
              text
            }
          }
          titel2 {
            node {
              text
            }
          }
          particalCanvasOptions {
            node {
              density
              speed
              particleColor
              interactive
              background {
                node {
                  filePath
                }
              }
            }
          }
        }
      }
      addTextgenerateEffekt {
        node {
          text
        }
      }
      addButtonGrid {
        node {
          __typename
          title
          sortedUrlList {
            label
            url
          }
          listItem {
            nodes {
              __typename
              title
              label
              url
            }
          }
        }
      }
      addImageCompare {
        node {
          title
          compareComponentPropertys {
            node {
              autoplay
              firstimage {
                node {
                  filePath
                }
              }
              secondimage {
                node {
                  filePath
                }
              }
              slidemode
            }
          }
        }
      }
      addCarousel {
        node {
          __typename
          title
          initialindex
          sortedSlides {
            background {
              node {
                filePath
              }
            }
            uberschrift
            button
          }
          slides {
            nodes {
              __typename
              background {
                node {
                  filePath
                }
              }
              uberschrift
              button
            }
          }
        }
      }
    }
  }
}