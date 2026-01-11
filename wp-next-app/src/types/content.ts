/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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