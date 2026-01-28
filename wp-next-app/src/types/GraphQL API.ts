export type Page = {
    page: {
        content: string;
    }
}

export type NpFormBlock = {
    formBlock: {
        selectedValue: string,
        attributes: string
    }
}

export type SelectedValue = {
    label: string,
    value: string
}

export type NpContactForm = {
    npContactForm: {
        content: string,
        from: string,
        to: string,
        subject: string,
        message: string,
        attributes: string
    }
}

export type CheckboxDto = {
    checkbox: FormElement
}

export type FileUploadDto = {
    fileUpload: {
        subLabel: string,
    }&FormElement
}

export type DatePickerDto = {
    datePicker: FormElement
}

export type RadioGroupDto = {
    radioGroup: FormElement
}

export type SelectDto = {
    select: FormElement
}

export type SwitchDto = {
    switch: FormElement
}

export type TextareaDto = {
    textarea: FormElement
}

export type TextboxDto = {
    textbox: FormElement
}

type FormElement = {
    label: string,
    attributes: string,
    fieldName: string
}

export type CollapsibleDto = {
    collapsible: {
        attributes: string,
        childContent: string,
        triggerLabel: string
    }
}

export type ContainerScrollAniDto = {
    containerScrollAni: {
        attributes: string,
        childIds: string,
        childContent: string,
        background: string
    }
}

export type BackgroundBoxesDto = {
    backgroundBoxes: {
        attributes: string,
        childIds: string,
        childContent: string
    }
}

export type TextRevealCardDto = {
    textRevealCard: {
        text: string,
        revealText: string,
        cardTitle: string,
        cardDescription: string,
        attributes: string
    }
}

export type TextgenerateEffekt = {
    textgenEffekt: {
        words: string,
        duration: number,
        attributes: string
    }
}

export type LinkPreviewDto = {
    linkPreview: {
        url: string,
        label: string,
        attributes: string
    }
}

export type HeroParallaxDto = {
    parallaxHeroshot: {
        productListIds: string,
        attributes: string
    }
}

export type MacbookScrollDto = {
    macbookScroll: {
        attributes: string,
        src: string,
        showGradient: boolean,
        boxTitle: string
    }
}

export type ParallaxGridDto = {
    parallaxGrid: {
        attributes: string,
        images: string,
        imagesObjects: WordpressImage[]
    }
}

export type ThreeDMarqueeDto = {
    threeDMarquee: {
        attributes: string,
        images: string,
        imagesObjects: WordpressImage[]
    }
}

export type ThreeDCardDto = {
    threeDCard: {
        attributes: string,
        background: string,
        buttonLabel: string,
        buttonUrl: string,
        linkLable: string,
        linkUrl: string,
        cardHeader: string,
        subHeader: string,
        skew: boolean
    }
}

export type ThreeDPinCardDto = {
    threeDPinCard: {
        attributes: string,
        linkLable: string,
        linkUrl: string,
        cardHeader: string,
        subHeader: string
    }
}

export type ProgressDto = {
    progress: {
        attributes: string,
        value: number
    }
}

export type ButtonDto = {
    button: {
        attributes: string,
        url: string,
        label: string
    }
}

export type ExpandableCardContainerDto = {
    expCardContainer: {
        listMode: "Grid" | "List" | "",
        expandableCards: string,
        attributes: string
    }
}

export type ExpandableCardDto = {
    expandableCard: {
        ctaText: string,
        ctaLink: string,
        cardTitle: string,
        description: string,
        cardContent: string,
        src: string,
        attributes: string
    }
}

export type AccordionDto = {
    accordion: {
        accordionItems: string,
        attributes: string
    }
}

export type AccordionItemDto = {
    accordionItem: {
        cardHeader: string,
        childContent: string,
        attributes: string
    }
}

export type TracingBeamItemDto = {
    tracingBeamItem: {
        childContent: string,
        childIds: string,
        attributes: string
        itemTitle: string,
        badge: string,
        image: string
    }
}

export type StickyRevealItemDto = {
    stickyRevealItem: {
        childContent: string,
        childIds: string,
        attributes: string
        itemTitle: string,
        description: string
    }
}

export type TimelineItemDto = {
    timelineItem: {
        childContent: string,
        childIds: string,
        attributes: string
        itemTitle: string
    }
}

export type AnimatedTabDto = {
    animatedTab: {
        childContent: string,
        childIds: string,
        attributes: string
        tabTitle: string,
        tabValue: string
    }
}

export type TimelineContainerDto = {
    timelineContainer: {
        itemIds: string,
        attributes: string
    }
}

export type TracingBeamContainerDto = {
    tracBeamCon: {
        itemIds: string,
        attributes: string
    }
}

export type StickyRevealContainerDto = {
    stickyRevealCon: {
        itemIds: string,
        attributes: string
    }
}

export type AniTabControlDto = {
    animatedTabControl: {
        tabIds: string,
        attributes: string
    }
}

export type SimpleCarouselDto = {
    simpleCarousel: {
        slideIds: string,
        initialIndex:  number,
        attributes: string
    }
}

export type SimpleCarouselSlideDto = {
    sCarouselSlide: {
        background: string,
        label: string,
        attributes: string
    }
}

export type CarouselDto = {
    carousel: {
        slideIds: string,
        initialIndex:  number,
        attributes: string
    }
}

export type CarouselSlideDto = {
    carouselSlide: {
        background: string,
        label: string,
        buttonLabel:  string,
        attributes: string
    }
}

export type HeroParallaxProdDto = {
    heroParallaxProd: {
        url: string,
        label: string,
        background: string,
        attributes: string
    }
}

export type CompareDto = {
    compare: {
        autoplay: boolean,
        slidemode: "hover" | "drag" | undefined,
        firstImage: string,
        secondImage: string,
        attributes:  string
    }
}

export type MovingCardsDto = {
    movingCards: {
        testimonialList: string,
        attributes: string,
        direction?: "left" | "right";
        speed?: "fast" | "normal" | "slow";
        pauseOnHover: boolean
    }
}

export type AnimatedTestimonial = {
    animatedTestimonial: {
        testimonialList: string,
        attributes: string
    }
}

export type Testimonial = {
    testimonial: {
        quote: string,
        testimonialName: string,
        testimonialTitle: string,
        position: string,
        bild: string,
        attributes: string
    }
}

export type ButtonGridType = {
    buttonGrid: {
        listItemIds: string,
        attributes: string
    }
}

export type ListItem = {
    listItem: {
        attributes: string,
        url: string,
        label: string
    }
}

export type GeneralAttributes = {
    cptId: number,
    instanceId: string,
    className: string,
    fieldName: string
} & CptStyleAttributes


export type RadioGroupAttributesDto = {
    radioOptions: {
        label: string,
        value: string,
    }[]
}& GeneralAttributes

export type SelectAttributesDto = {
    selectValues: {
        label: string,
        value: string
    }[]
}& GeneralAttributes



export type CptStyleAttributes = {
    style: {
        css: string,
        color: {
            text: string
        },
        "elements": {
            "link": {
                "color": {
                    "text": string
                }
            }
        },
        typography: {
            fontSize: string
        }
    }
    textColor: string,
    fontSize: string
}

type WordpressImageSize = {
    height: number;
    width: number;
    url: string;
    orientation: 'landscape' | 'portrait' | 'square';
};

type WordpressImage = {
    sizes: {
        thumbnail: WordpressImageSize;
        medium: WordpressImageSize;
        large: WordpressImageSize;
        full: WordpressImageSize;
    };
    mime: string;
    type: string;
    subtype: string;
    id: number;
    url: string;
    alt: string;
    link: string;
    caption: string;
};