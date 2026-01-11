export type ExpandableCard = {
    description: string,
    title: string,
    src: string,
    ctaText: string,
    ctaLink: string,
    content: JSX.Element;
}

export type ExpandableCardsProp = {
    cards: Array<ExpandableCard>,
    listMode:  "Grid" | "List" | ""
}