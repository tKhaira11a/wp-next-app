import { ContentNode } from "@/gql/graphql";
import React from "react";

export type FormValues = {
    [key: string]: any;
}

export type Block = {
    clientId: string;
    name: string;
    isValid: boolean;
    originalContent: string;
    validationIssues: {};
    attributes: any;
    innerBlocks: Array<Block>;
};

export type AccordionData = {
    header:  string,
    childContent: React.ReactNode,
    fontSize: string | undefined,
    textColor: string | undefined,
    attributes: string | undefined
}

export type SlideData = {
    title: string,
    button: string,
    src: string,
    fontSize: string | undefined,
    textColor: string | undefined
};

export type Product = {
    title: string,
    link: string,
    thumbnail: string,
    fontSize: string | undefined,
    textColor: string | undefined
};

export type ProductsJson = {
    products: Product[];
};

export type MovingCardsProps = {
    items: {
        quote: string;
        name: string;
        title: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    fontSize: string | undefined;
    textColor: string | undefined;
}

export type Testimonial = {
    quote: string;
    testimonialName: string;
    position: string;
    bild: string;
    fontSize: string | undefined;
    textColor: string | undefined;
}

export interface CarouselControlProps {
    type: string;
    title: string;
    handleClick: () => void;
}

export interface SlideProps {
    slide: SlideData;
    index: number;
    current: number;
    handleSlideClick: (index: number) => void;
}

export interface CarouselProps {
    slides: SlideData[];
    initialIndex?: number;
}

export interface TemplateProps {
    node: ContentNode;
}

export type ButtonGridProps = {
    hyperlinkListe:
        {
            title: string,
            label: string,
            url: string,
            textColor: string | undefined,
            fontSize: string | undefined,
        }[]
};

export type Tab = {
    title: string,
    value: string,
    content?: string | React.ReactNode | any
}

export type TimelineEntry = {
    title: string,
    content: React.ReactNode,
    badge?: string,
    image?: string,
    attributes?: string,
}

export type StickyRevealContent = {
    title: string,
    description: string,
    content?: React.ReactNode | any,
    attributes?: string,
}