import { cn } from "@/lib/utils";
import {fetchGraphQL} from "@/utils/fetchGraphQL";
import {print} from "graphql/language/printer";
import React from "react";
import {getFontSizeFromAttributes, getTextColorFromAttributes} from "@/utils/helper";
import {parseStyleString, prepareHtmlContent} from "@/utils/ParsingHelper";
import {
    TextgenerateEffekt,
    ListItem,
    ButtonGridType,
    BackgroundBoxesDto,
    AnimatedTestimonial,
    Testimonial,
    CompareDto,
    HeroParallaxDto,
    HeroParallaxProdDto,
    CarouselDto,
    CarouselSlideDto,
    AccordionDto,
    AccordionItemDto,
    ButtonDto,
    SimpleCarouselDto,
    SimpleCarouselSlideDto,
    ProgressDto,
    CollapsibleDto,
    GeneralAttributes,
    ThreeDCardDto,
    ThreeDMarqueeDto,
    ThreeDPinCardDto,
    ContainerScrollAniDto,
    ExpandableCardContainerDto,
    ExpandableCardDto,
    LinkPreviewDto,
    MovingCardsDto,
    TextRevealCardDto,
    ParallaxGridDto,
    AniTabControlDto,
    AnimatedTabDto,
    MacbookScrollDto,
    TimelineContainerDto,
    TimelineItemDto,
    TracingBeamContainerDto,
    TracingBeamItemDto,
    StickyRevealContainerDto, StickyRevealItemDto, NpContactForm, NpFormBlock, SelectedValue
} from '@/types/GraphQL API';
import {
    AccordionData,
    MovingCardsProps,
    Product,
    SlideData,
    Testimonial as TestimonialVob,
    Tab as TabVob,
    TimelineEntry, StickyRevealContent
} from "@/types/content";
import {ParticalCanvasBlockOptions } from "@/types/components/particalCanvasOptions";
import {Carousel} from "@/components/ui/Carousel";
import {Carousel as SimpleCarousel} from "@/components/ui/SimpleCarousel";
import {Compare} from "@/components/ui/Compare";
import ParticalCanvas from "@/components/ui/ParticalCanvas";
import {HeroParallax} from "@/components/ui/HeroParallax";
import {AnimatedTestimonials} from "@/components/ui/AnimatedTestimonials";
import ButtonGrid from "@/components/ui/ButtonGrid";
import {BackgroundBoxes} from "@/components/ui/BackgroundBoxes";
import {TextGenerateEffect} from "@/components/ui/TextGenerateEffect";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/Accordion";
//import {Button} from "@/components/ui/form-elements/Button";
import {Button} from "@/components/ui/button";
import {CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/SimpleCarousel";
import {Card, CardContent} from "@/components/ui/SimpleCard";
import {Progress} from "@/components/ui/Progress";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/Collapsible";
import { ChevronsUpDown } from "lucide-react";
import {CardBody, CardContainer, CardItem} from "@/components/ui/3d-card";
import {ThreeDMarquee} from "@/components/ui/3d-marquee";
import {PinContainer} from "@/components/ui/3d-pin";
import {ContainerScroll} from "@/components/ui/container-scroll-animation";
import ExpandableCard from "@/components/ui/expandable-card";
import {LinkPreview} from "@/components/ui/link-preview";
import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
import {TextRevealCard, TextRevealCardDescription, TextRevealCardTitle} from "@/components/ui/text-reveal-card";
import {ParallaxGrid} from "@/components/ui/ParallaxGrid";
import {Tabs} from "@/components/ui/tabs";
import {MacbookScroll} from "@/components/ui/macbook-scroll";
import {Timeline} from "@/components/ui/timeline";
import {TracingBeam} from "@/components/ui/tracing-beam";
import {twMerge} from "tailwind-merge";
import {StickyScroll} from "@/components/ui/sticky-scroll-reveal";
import {BackgroundBoxesQuery} from "@/queries/CPTs/background-boxes";
import {AnimatedTestimonialQuery} from "@/queries/CPTs/animated-testimonial";
import {TextGenQuery} from "@/queries/CPTs/textgenerate-effekt";
import {TestimonialQuery} from "@/queries/CPTs/testimonial";
import {CompareQuery} from "@/queries/CPTs/compare";
import {HeroParallaxQuery} from "@/queries/CPTs/hero-parallax";
import {HeroParallaxProdQuery} from "@/queries/CPTs/hero-parallax-prod";
import {ButtonGridQuery} from "@/queries/CPTs/button-grid";
import {ListItemQuery} from "@/queries/CPTs/list-item";
import {ParticalCanvasQuery} from "@/queries/CPTs/partical-canvas";
import {CarouselQuery} from "@/queries/CPTs/carousel";
import {CarouselSlideQuery} from "@/queries/CPTs/carousel_slide";
import {AccordionQuery} from "@/queries/CPTs/accordion";
import {AccordionItemQuery} from "@/queries/CPTs/accordion-item";
import {SimpleCarouselQuery} from "@/queries/CPTs/simple-carousel";
import {SimpleCarouselSlideQuery} from "@/queries/CPTs/simple-carousel-slide";
import {ProgressQuery} from "@/queries/CPTs/progress";
import {CollapsibleQuery} from "@/queries/CPTs/collapsible";
import {ThreeDCardQuery} from "@/queries/CPTs/three-d-card";
import {ThreeDMarqueeQuery} from "@/queries/CPTs/three-d-marquee";
import {ThreeDPinCardQuery} from "@/queries/CPTs/three-d-pin-card";
import {ContainerScrollAniQuery} from "@/queries/CPTs/container-scroll-ani";
import {ExpandableCardContainerQuery} from "@/queries/CPTs/expandable-card-container";
import {ExpandableCardQuery} from "@/queries/CPTs/expandable-card";
import {LinkPreviewQuery} from "@/queries/CPTs/link-preview";
import {MovingCardsQuery} from "@/queries/CPTs/moving-cards";
import {TextRevealCardQuery} from "@/queries/CPTs/text-reveal-card";
import {AnimatedTabQuery} from "@/queries/CPTs/animated-tab";
import {AniTabControlQuery} from "@/queries/CPTs/animated-tab-control";
import {ParallaxGridQuery} from "@/queries/CPTs/parallax-grid";
import {MacbookScrollQuery} from "@/queries/CPTs/macbook-scroll";
import {TimelineContainerQuery} from "@/queries/CPTs/timeline-container";
import {TimelineItemQuery} from "@/queries/CPTs/timeline-item";
import {TracingBeamContainerQuery} from "@/queries/CPTs/tracing-beam-container";
import {TracingBeamItemQuery} from "@/queries/CPTs/tracing-beam-item";
import {StickyRevealContainerQuery} from "@/queries/CPTs/sticky-reveal-container";
import {StickyRevealItemQuery} from "@/queries/CPTs/sticky-reveal-item";
import {ExpandableCardsProp} from "@/types/components/expandableCards";
import {parseHtmlWithComponents } from "./ComponentFactory";
import { NpContactFormQuery} from "@/queries/general/NpContactformQuery";
import {GenericForm} from "@/components/Templates/NpContact/GenericForm";
import {buildForm} from "@/utils/ContactFormFactory";
import {NpFormBlockQuery} from "@/queries/general/NpFormBlockQuery";

export const componentFactoryMap: Record<string,(id: string) => Promise<JSX.Element>> = {
    "TextGenerateEffect": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<TextgenerateEffekt>(
            print(TextGenQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.textgenEffekt.attributes);
        const textColor: string | undefined = getTextColorFromAttributes(parsedAttrs);
        const fontSize: string | undefined = getFontSizeFromAttributes(parsedAttrs);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        return (
            <div className={cn(parsedAttrs.className)}>
                <TextGenerateEffect
                    words={data.textgenEffekt.words ?? "Fail"}
                    duration={data.textgenEffekt.duration ?? 1}
                    fontSize={fontSize}
                    textColor={textColor}
                    style={styles}
                />
            </div>
    );
    },
    "ButtonGrid": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ButtonGridType>(
            print(ButtonGridQuery),
            { id: id }
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.buttonGrid.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let listItemList:Array<ListItem> = [];
        for(const id of JSON.parse(data.buttonGrid.listItemIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<ListItem>(
                print(ListItemQuery),
                { id: id }
            );
            listItemList.push(listItem);
        }

        const hyperlinkListe = listItemList.map(({ listItem }) => ({
            title: listItem.label,
            label: listItem.label,
            url: listItem.url,
            textColor: getTextColorFromAttributes(JSON.parse(listItem.attributes)) ?? getTextColorFromAttributes(parsedAttrs),
            fontSize: getFontSizeFromAttributes(JSON.parse(listItem.attributes)) ?? getFontSizeFromAttributes(parsedAttrs)
        }));

        return (
            <div style={styles} className={cn(parsedAttrs.className)}>
                <ButtonGrid
                    hyperlinkListe={hyperlinkListe}
                />
            </div>
    )
    },
    "ParticalCanvas": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ParticalCanvasBlockOptions>(
            print(ParticalCanvasQuery),
            { id: id }
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.particalCanvas.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");

        const childContent: string = data.particalCanvas.childContent;
        const htmlWithPlaceholders = prepareHtmlContent(childContent);
        let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);
        // @ts-ignore
        childComponents = childComponents.map((value, index) => {
            if(value.type == React.Fragment && value.props.children) {
                return React.Children.toArray(value.props.children).map((grandChild, index) => {
                    if (React.isValidElement(grandChild)) {
                        return React.cloneElement(grandChild, {
                            key: grandChild.key || index,
                            // @ts-ignore
                            style: {
                                ...(grandChild.props.style || {}),
                                zIndex: 2,
                                position: "relative"
                            }
                        });
                    }
                    return grandChild as JSX.Element;
                }) as JSX.Element[];
            }
            return React.cloneElement(value, {
                style: {
                    ...(value.props.style || {}),
                    zIndex: 2,
                    position: 'relative',
                }
            }) as JSX.Element;
        });

        return (
            <div style={styles} className={cn("h-[70vh] max-h-[70vmin] mb-[24px]", parsedAttrs.className)}>
                <ParticalCanvas particalCanvasBlockOptions={ data }>
                    {childComponents}
                </ParticalCanvas>
            </div>
        )
    },
    "BackgroundBoxes": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<BackgroundBoxesDto>(
            print(BackgroundBoxesQuery),
            { id: id }
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.backgroundBoxes.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");

        const childContent: string = data.backgroundBoxes.childContent;
        const htmlWithPlaceholders = prepareHtmlContent(childContent);
        let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);

        return (
            <div style={styles} className={cn("h-96 relative overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg w-[100vmin] mx-auto", parsedAttrs.className)}>
                <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                <BackgroundBoxes />
                {childComponents}
            </div>
        );
    },
    "AnimatedTestimonials": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<AnimatedTestimonial>(
            print(AnimatedTestimonialQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.animatedTestimonial.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let testimonialList:Array<Testimonial> = [];
        for(const id of JSON.parse(data.animatedTestimonial.testimonialList)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<Testimonial>(
                print(TestimonialQuery),
                { id: id }
            );
            testimonialList.push(listItem);
        }

        const mappedTestimonials: TestimonialVob[] = testimonialList.map(({ testimonial }) => ({
            quote: testimonial.quote,
            testimonialName: testimonial.quote,
            position: testimonial.position,
            bild: testimonial.bild,
            textColor: getTextColorFromAttributes(JSON.parse(testimonial.attributes)) ?? getTextColorFromAttributes(parsedAttrs),
            fontSize: getFontSizeFromAttributes(JSON.parse(testimonial.attributes)) ?? getFontSizeFromAttributes(parsedAttrs)
        }));


        return (
            <div style={styles} className={cn(parsedAttrs.className)}>
                <AnimatedTestimonials
                    key={parseInt(id)}
                    testimonials={mappedTestimonials}
                />
            </div>
    )
    },
    "Compare": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<CompareDto>(
            print(CompareQuery),
            { id: id }
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.compare.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        return (
            <div style={styles} className={cn(parsedAttrs.className)}>
                <Compare
                    key={parseInt(id)}
                    firstImage={data.compare.firstImage}
                    secondImage={data.compare.secondImage}
                    slideMode={data.compare.slidemode}
                    autoplay={data.compare.autoplay}
                />
            </div>
    );
    },
    "HeroParallax": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<HeroParallaxDto>(
            print(HeroParallaxQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.parallaxHeroshot.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let heroParallaxProdDtoList:Array<HeroParallaxProdDto> = [];
        for(const id of JSON.parse(data.parallaxHeroshot.productListIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<HeroParallaxProdDto>(
                print(HeroParallaxProdQuery),
                { id: id }
            );
            heroParallaxProdDtoList.push(listItem);
        }

        const mappedProducts: Product[] = heroParallaxProdDtoList.map(({ heroParallaxProd }) => ({
            title: heroParallaxProd.label,
            link: heroParallaxProd.url,
            thumbnail: heroParallaxProd.background,
            textColor: getTextColorFromAttributes(JSON.parse(heroParallaxProd.attributes)) ?? getTextColorFromAttributes(parsedAttrs),
            fontSize: getFontSizeFromAttributes(JSON.parse(heroParallaxProd.attributes)) ?? getFontSizeFromAttributes(parsedAttrs)
        }));

        return (
            <div style={styles} className={cn(parsedAttrs.className)}>
                <HeroParallax key={parseInt(id)} products={mappedProducts} />
            </div>
    )
    },
    "Carousel": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<CarouselDto>(
            print(CarouselQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.carousel.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let carouselSlideDtoList:Array<CarouselSlideDto> = [];
        for(const id of JSON.parse(data.carousel.slideIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<CarouselSlideDto>(
                print(CarouselSlideQuery),
                { id: id }
            );
            carouselSlideDtoList.push(listItem);
        }

        const mappedSlides: SlideData[] = carouselSlideDtoList.map(({ carouselSlide }) => ({
            title: carouselSlide.label,
            button: carouselSlide.buttonLabel,
            src: carouselSlide.background,
            textColor: getTextColorFromAttributes(JSON.parse(carouselSlide.attributes)) ?? getTextColorFromAttributes(parsedAttrs),
            fontSize: getFontSizeFromAttributes(JSON.parse(carouselSlide.attributes)) ?? getFontSizeFromAttributes(parsedAttrs)
        }));

        return (
            <div style={styles} className={cn("overflow-x-clip", parsedAttrs.className)}>
            <Carousel
                initialIndex={data.carousel.initialIndex}
                slides={mappedSlides}
            />
        </div>
    );
    },
    "Accordion": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<AccordionDto>(
            print(AccordionQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.accordion.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let accordionItemDtoList:Array<AccordionItemDto> = [];
        for(const id of JSON.parse(data.accordion.accordionItems)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<AccordionItemDto>(
                print(AccordionItemQuery),
                { id: id }
            );
            accordionItemDtoList.push(listItem);
        }

        const mappedItems: Array<AccordionData> = await Promise.all(
            accordionItemDtoList.map(async value => {
                const childContent: string = value.accordionItem.childContent;
                const htmlWithPlaceholders = prepareHtmlContent(childContent);
                let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);
                return {
                    header: value.accordionItem.cardHeader,
                    childContent: (
                        <>
                            {childComponents}
                        </>
                    ),
                    textColor: getTextColorFromAttributes(JSON.parse(value.accordionItem.attributes)) ?? getTextColorFromAttributes(parsedAttrs),
                    fontSize: getFontSizeFromAttributes(JSON.parse(value.accordionItem.attributes)) ?? getFontSizeFromAttributes(parsedAttrs),
                    attributes: value.accordionItem.attributes
                }
            })
        )

        return (
            <div className={parsedAttrs.className}>
                <Accordion style={styles} type="single" collapsible>
                    {mappedItems.map((value, index) => {
                        let parsedChildAttrs: GeneralAttributes = JSON.parse(value.attributes ?? "");
                        let childStyles = parseStyleString(parsedChildAttrs.style?.css ?? "");
                        return (
                            <div style={childStyles} key={index} className={parsedChildAttrs.className}>
                                <AccordionItem value={"item-" +index}  key={index}>
                                    <AccordionTrigger>
                                        <span style={{
                                        color: value.textColor,
                                            fontSize: value.fontSize,
                                        }}>
                                        {value.header}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div style={{
                                            color: value.textColor,
                                                fontSize: value.fontSize,
                                        }}>
                                        {value.childContent}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        )
                    })}
                </Accordion>
            </div>
        );
    },
    "SimpleCarousel": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<SimpleCarouselDto>(
            print(SimpleCarouselQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.simpleCarousel.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let carouselSlideDtoList:Array<SimpleCarouselSlideDto> = [];
        for(const id of JSON.parse(data.simpleCarousel.slideIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<SimpleCarouselSlideDto>(
                print(SimpleCarouselSlideQuery),
                { id: id }
            );
            carouselSlideDtoList.push(listItem);
        }

        return (
            <div className={parsedAttrs.className}>
                <SimpleCarousel style={styles} className="w-full max-w-xs" opts={{startIndex: data.simpleCarousel.initialIndex}}>
                    <CarouselContent>
                        {carouselSlideDtoList.map((value, index) => {
                            let parsedChildAttrs: GeneralAttributes = JSON.parse(value.sCarouselSlide.attributes);
                            let childStyles = parseStyleString(parsedChildAttrs.style?.css ?? "");
                            return (
                                <CarouselItem style={childStyles} key={index}>
                                    <div className="p-1">
                                        <Card background={value.sCarouselSlide.background}>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <span
                                                    style={{
                                                        color: getTextColorFromAttributes(JSON.parse(value.sCarouselSlide.attributes)) ?? getTextColorFromAttributes(parsedAttrs),
                                                        fontSize: getFontSizeFromAttributes(JSON.parse(value.sCarouselSlide.attributes)) ?? getFontSizeFromAttributes(parsedAttrs)
                                                    }}
                                                className="text-4xl font-semibold">
                                                    {value.sCarouselSlide.label}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </SimpleCarousel>
            </div>
        )
    },
    "Progress": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ProgressDto>(
            print(ProgressQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.progress.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        return (
            <div className={parsedAttrs.className}>
                <Progress
                    style={styles}
                    value={data.progress.value}
                />
            </div>
    )
    },
    "Collapsible": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<CollapsibleDto>(
            print(CollapsibleQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.collapsible.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        const childContent: string = data.collapsible.childContent;
        const htmlWithPlaceholders = prepareHtmlContent(childContent);
        let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);

        return (
            <div className={parsedAttrs.className}>
                <Collapsible style={styles}>
                    <div className="flex items-center justify-between space-x-4 px-4">
                        <h4
                            style={{
                                color: getTextColorFromAttributes(parsedAttrs),
                                fontSize: getFontSizeFromAttributes(parsedAttrs)
                            }}
                            className="text-sm font-semibold">
                            {data.collapsible.triggerLabel}
                        </h4>
                        <CollapsibleTrigger>
                        <button className="IconButton">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span
                                style={{
                                    color: getTextColorFromAttributes(parsedAttrs),
                                    fontSize: getFontSizeFromAttributes(parsedAttrs)
                                }}
                                className="sr-only">{data.collapsible.triggerLabel}
                            </span>
                        </button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        {childComponents}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    },
    "3dCard": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ThreeDCardDto>(
            print(ThreeDCardQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.threeDCard.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        return (
            <div style={styles} className={parsedAttrs.className}>
                <CardContainer className="inter-var">
                    <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                        >
                            {data.threeDCard.cardHeader}
                        </CardItem>
                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                        >
                            {data.threeDCard.subHeader}
                        </CardItem>
                        <CardItem
                            translateZ="100"
                            rotateX={data.threeDCard.skew ? 20 : undefined}
                            rotateY={data.threeDCard.skew ? -10 : undefined}
                            className="w-full mt-4">
                            <img
                                src={data.threeDCard.background}
                                height="1000"
                                width="1000"
                                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                alt="thumbnail"
                            />
                        </CardItem>
                        <div className="flex justify-between items-center mt-20">
                            {data.threeDCard.linkLable &&
                                <CardItem
                                    translateZ={20}
                                    translateX={data.threeDCard.skew ? -40 : undefined}
                                    as="a"
                                    href={data.threeDCard.linkUrl}
                                    target="__blank"
                                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                                >
                                    {data.threeDCard.linkLable} →
                                </CardItem>
                            }
                            {data.threeDCard.buttonLabel &&
                                <CardItem
                                    translateZ={20}
                                    translateX={data.threeDCard.skew ? 40 : undefined}
                                    as="button"
                                    href={data.threeDCard.buttonUrl}
                                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                                >
                                    {data.threeDCard.buttonLabel}
                                </CardItem>
                            }
                        </div>
                    </CardBody>
                </CardContainer>
            </div>
        )
    },
    "3dMarquee": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ThreeDMarqueeDto>(
            print(ThreeDMarqueeQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.threeDMarquee.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        data.threeDMarquee.imagesObjects = JSON.parse(data.threeDMarquee.images);

        const images = data.threeDMarquee.imagesObjects.map(value => {
            return value.url;
        })
        return (
            <div style={styles} className={cn(parsedAttrs.className, "mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800")}>
                <ThreeDMarquee images={images} />
            </div>
    )
    },
    "3dPinCard": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ThreeDPinCardDto>(
            print(ThreeDPinCardQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.threeDPinCard.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");

        return (
            <div style={styles} className={cn(parsedAttrs.className, "h-[40rem] w-full flex items-center justify-center")}>
                <PinContainer
                    title={data.threeDPinCard.linkLable}
                    href={data.threeDPinCard.linkUrl}
                >
                    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                        <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                            {data.threeDPinCard.cardHeader}
                        </h3>
                        <div className="text-base !m-0 !p-0 font-normal">
                        <span className="text-slate-500 ">
                            {data.threeDPinCard.subHeader}
                        </span>
                    </div>
                    <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
                    </div>
                </PinContainer>
            </div>
    )
    },
    "ContainerScrollAnimation":  async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ContainerScrollAniDto>(
            print(ContainerScrollAniQuery),
            { id: id }
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.containerScrollAni.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");

        const childContent: string = data.containerScrollAni.childContent;
        const htmlWithPlaceholders = prepareHtmlContent(childContent);
        let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);

        return (
            <div style={styles} className={cn(parsedAttrs.className, "flex flex-col overflow-hidden")}>
                <ContainerScroll
                    titleComponent={
                        <>
                            {childComponents}
                        </>
                    }
                >
                    <img
                        src={data.containerScrollAni.background}
                        alt="hero"
                        height={720}
                        width={1400}
                        className="mx-auto rounded-2xl object-cover h-full object-left-top"
                        draggable={false}
                    />
                </ContainerScroll>
            </div>
        );
    },
    "ExpandableCardContainer":  async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ExpandableCardContainerDto>(
            print(ExpandableCardContainerQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.expCardContainer.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let expandableCardDtoList:Array<ExpandableCardDto> = [];
        for(const id of JSON.parse(data.expCardContainer.expandableCards)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<ExpandableCardDto>(
                print(ExpandableCardQuery),
                { id: id }
            );
            expandableCardDtoList.push(listItem);
        }

        const props: ExpandableCardsProp = {
            cards: expandableCardDtoList.map(expandableCard => ({
                title: expandableCard.expandableCard.cardTitle,
                description: expandableCard.expandableCard.description,
                ctaText: expandableCard.expandableCard.ctaText,
                ctaLink: expandableCard.expandableCard.ctaLink,
                src: expandableCard.expandableCard.src,
                content:  (
                    <p>
                        {expandableCard.expandableCard.cardContent}
                    </p>
                )
            })),
            listMode: data.expCardContainer.listMode
        };

        return (
            <div style={styles} className={parsedAttrs.className}>
                <ExpandableCard
                    cards={props.cards}
                    listMode={props.listMode}
                >
                </ExpandableCard>
            </div>
        );
    },
    "LinkPreview":  async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<LinkPreviewDto>(
            print(LinkPreviewQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.linkPreview.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");

        return (
            <div style={styles} className={parsedAttrs.className}>
                <LinkPreview url={data.linkPreview.url} className="font-bold">
                    {data.linkPreview.label}
                </LinkPreview>{" "}
            </div>
    )
    },
    "MovingCards": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<MovingCardsDto>(
            print(MovingCardsQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.movingCards.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let testimonialList:Array<Testimonial> = [];
        for(const id of JSON.parse(data.movingCards.testimonialList)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<Testimonial>(
                print(TestimonialQuery),
                { id: id }
            );
            testimonialList.push(listItem);
        }

        const movingCardsProps: MovingCardsProps = {
            items: testimonialList.map(({ testimonial }) => ({
                quote: testimonial.quote,
                name: testimonial.testimonialName,
                title: testimonial.testimonialTitle
            })),
            speed: data.movingCards.speed,
            direction: data.movingCards.direction,
            pauseOnHover: data.movingCards.pauseOnHover,
            textColor: getTextColorFromAttributes(parsedAttrs),
            fontSize: getFontSizeFromAttributes(parsedAttrs)
        };


        return (
            <div style={styles} className={cn("h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden ", parsedAttrs.className)}>
                <InfiniteMovingCards
                    items={movingCardsProps.items}
                    direction={movingCardsProps.direction}
                    speed={movingCardsProps.speed}
                    pauseOnHover={movingCardsProps.pauseOnHover}
                    textColor={movingCardsProps.textColor}
                    fontSize={movingCardsProps.fontSize}
                />
            </div>
        )
    },
    "TextRevealCard": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<TextRevealCardDto>(
            print(TextRevealCardQuery),
            {id: id}
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.textRevealCard.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let textColor: string | undefined = getTextColorFromAttributes(parsedAttrs);
        let fontSize: string | undefined = getFontSizeFromAttributes(parsedAttrs);
        return (
            <div style={styles} className={cn("flex items-center justify-center bg-[#0E0E10] rounded-2xl w-full", parsedAttrs.className)}>
                <TextRevealCard
                    text={data.textRevealCard.text}
                    revealText={data.textRevealCard.revealText}
                    color={textColor}
                    fontSize={fontSize}
                >
                    <TextRevealCardTitle>
                        {data.textRevealCard.cardTitle}
                    </TextRevealCardTitle>
                    <TextRevealCardDescription>
                        {data.textRevealCard.cardDescription}
                    </TextRevealCardDescription>
                </TextRevealCard>
            </div>
        );
    },
    "ParallaxGrid": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ParallaxGridDto>(
            print(ParallaxGridQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.parallaxGrid.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        data.parallaxGrid.imagesObjects = JSON.parse(data.parallaxGrid.images);

        const images = data.parallaxGrid.imagesObjects.map(value => {
            return value.url;
        })
        return (
            <div style={styles} className={parsedAttrs.className}>
                <ParallaxGrid images={images} />
            </div>
    )
    },
    "AniTabControl": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<AniTabControlDto>(
            print(AniTabControlQuery),
            {id: id}
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.animatedTabControl.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let tabDtoList:Array<AnimatedTabDto> = [];
        for(const id of JSON.parse(data.animatedTabControl.tabIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<AnimatedTabDto>(
                print(AnimatedTabQuery),
                { id: id }
            );
            tabDtoList.push(listItem);
        }

        const tabs: Array<TabVob> = await Promise.all(
            tabDtoList.map(async value => {
                const childContent: string = value.animatedTab.childContent;
                const htmlWithPlaceholders = prepareHtmlContent(childContent);
                let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);
                return {
                    title: value.animatedTab.tabTitle,
                    value: value.animatedTab.tabValue,
                    content: (
                        <div className={cn(parsedAttrs.className, "w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900")}>
                            {childComponents}
                        </div>
                    )
                }
            })
        )
        return (
            <div style={styles} className={"h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40 "+parsedAttrs.className}>
                <Tabs tabs={tabs} />
            </div>
        )
    },
    "MacbookScroll": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<MacbookScrollDto>(
            print(MacbookScrollQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.macbookScroll.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");

        return (
            <div style={styles} className={cn("overflow-hidden dark:bg-[#0B0B0F] bg-white w-full ", parsedAttrs.className)}>
                <MacbookScroll
                    title={
                        <span>
                            {data.macbookScroll.boxTitle}
                        </span>
                    }
                    src={data.macbookScroll.src || undefined}
                    showGradient={data.macbookScroll.showGradient}
                />
            </div>
    )
    },
    "TimelineContainer": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<TimelineContainerDto>(
            print(TimelineContainerQuery),
            {id: id}
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.timelineContainer.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let itemDtoList:Array<TimelineItemDto> = [];
        for(const id of JSON.parse(data.timelineContainer.itemIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<TimelineItemDto>(
                print(TimelineItemQuery),
                { id: id }
            );
            itemDtoList.push(listItem);
        }

        const items: Array<TimelineEntry> = await Promise.all(
            itemDtoList.map(async value => {
                const childContent: string = value.timelineItem.childContent;
                const htmlWithPlaceholders = prepareHtmlContent(childContent);
                let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);
                return {
                    title: value.timelineItem.itemTitle,
                    content: (
                        <div className={cn(parsedAttrs.className, "w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900")}>
                            {childComponents}
                        </div>
                    )
                }
            })
        )

        return (
            <div style={styles} className={"relative w-full overflow-clip "+parsedAttrs.className}>
                <Timeline data={items} />
            </div>
    )
    },
    "TracingBeamContainer": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<TracingBeamContainerDto>(
            print(TracingBeamContainerQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data?.tracBeamCon?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let itemDtoList:Array<TracingBeamItemDto> = [];
        for(const id of JSON.parse(data.tracBeamCon.itemIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<TracingBeamItemDto>(
                print(TracingBeamItemQuery),
                { id: id }
            );
            itemDtoList.push(listItem);
        }

        const items: Array<TimelineEntry> = await Promise.all(
            itemDtoList.map(async value => {
                const childContent: string = value.tracingBeamItem.childContent;
                const htmlWithPlaceholders = prepareHtmlContent(childContent);
                let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);
                return {
                    title: value.tracingBeamItem.itemTitle,
                    content: (
                        <>
                            {childComponents}
                        </>
                    ),
                    image: value.tracingBeamItem.image,
                    badge: value.tracingBeamItem.badge,
                    attributes: value.tracingBeamItem.attributes,
                }
            })
        )

        return (
            <div className={cn(parsedAttrs.className)} style={styles} >
                <TracingBeam>
                    <div className={cn("max-w-2xl mx-auto antialiased pt-4 relative", parsedAttrs.className)}>
                        {items.map((item, index) => {

                            let parsedChildAttrs: GeneralAttributes = JSON.parse(item.attributes ?? "{}");
                            let childStyles = parseStyleString(parsedChildAttrs.style?.css ?? "");
                            return (
                                <div key={`content-${index}`} style={childStyles} className="mb-10">
                                    <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
                                        {item.badge}
                                    </h2>
                                    <p className={twMerge("text-xl mb-4")}>
                                        {item.title}
                                    </p>
                                    <div className="text-sm  prose prose-sm dark:prose-invert">
                                        {item?.image && (
                                            <img
                                                src={item.image}
                                                alt="blog thumbnail"
                                                height="1000"
                                                width="1000"
                                                className="rounded-lg mb-10 object-cover"
                                            />
                                        )}
                                        {item.content}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </TracingBeam>
            </div>
        )
    },
    "StickyRevContainer": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<StickyRevealContainerDto>(
            print(StickyRevealContainerQuery),
            {id: id}
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(data.stickyRevealCon.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        let itemDtoList:Array<StickyRevealItemDto> = [];
        for(const id of JSON.parse(data.stickyRevealCon.itemIds)) {
            if(!id) {
                continue;
            }
            let listItem = await fetchGraphQL<StickyRevealItemDto>(
                print(StickyRevealItemQuery),
                { id: id }
            );
            itemDtoList.push(listItem);
        }

        const items: Array<StickyRevealContent> = await Promise.all(
            itemDtoList.map(async value => {
                const childContent: string = value.stickyRevealItem.childContent;
                const htmlWithPlaceholders = prepareHtmlContent(childContent);
                let childComponents =  await parseHtmlWithComponents(htmlWithPlaceholders);
                return {
                    title: value.stickyRevealItem.itemTitle,
                    description: value.stickyRevealItem.description,
                    content: (
                        <div className={cn(parsedAttrs.className, "w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold")}>
                            {childComponents}
                        </div>
                    ),
                    attributes: value.stickyRevealItem.attributes,
                }
            })
        )

        return (
            <div style={styles} className={"w-full py-4 "+parsedAttrs.className}>
                <StickyScroll content={items} />
            </div>
        )
    },
    "NpContactForm": async (id: string): Promise<JSX.Element> => {
        const {formBlock} = await fetchGraphQL<NpFormBlock>(
            print(NpFormBlockQuery),
            { id: id }
        );

        let selectedValue: SelectedValue = {
            label: "",
            value: ""
        };
        try {
            selectedValue = JSON.parse(formBlock.selectedValue);
        }catch (error) {
            return (<span>No valid Form Selected</span>);
        }
        const {npContactForm} = await fetchGraphQL<NpContactForm>(
            print(NpContactFormQuery),
            { id: selectedValue.value }
        );

        const htmlWithPlaceholders = prepareHtmlContent(npContactForm.content);
        let childComponents =  await buildForm(htmlWithPlaceholders);

        let parsedAttrs: GeneralAttributes = JSON.parse(
            npContactForm.attributes?.trim() ? npContactForm.attributes : "{}"
        );
        return (
            <div className={cn(parsedAttrs.className, "contact-form")}>
                <GenericForm npContactForm={npContactForm} cptId={id}>
                    {childComponents}
                </GenericForm>
            </div>
        )
    }

    /*
    // Beispiel für weiteren Typ:
    anotherComponent: async (id: string): Promise<JSX.Element> => {
        const data = await fetchOtherData(id);
        return <OtherComponent someProp={data.someProp} />;
    },
    */
};