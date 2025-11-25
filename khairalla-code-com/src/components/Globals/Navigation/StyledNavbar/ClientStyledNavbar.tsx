"use client";
import React, {useEffect, useState} from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../../../ui/Menu";
import { cn } from "@/lib/utils";
import {MenuItem as GraphMenuItem} from "@/gql/graphql";
import {StyledNavbarProps} from "@/types/components/StyledNavbarProps";
import {DarkmodeToggle} from "@/components/ui/DarkmodeToggle";

//todo: @kaNovalis1802 ts-ignor -> check types
export default function ClientStyledNavbar({ className, menuItems }: StyledNavbarProps) {
    const [active, setActive] = useState<string | null>(null);
    const [darkmode, setDarkmode] = React.useState(true);
    useEffect(() => {
        if (darkmode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkmode]);

    const filtertMenuItems = menuItems.nodes.filter((item : GraphMenuItem) =>
        // @ts-ignore
        item?.childItems?.nodes.length > 0 ||
        !menuItems.nodes.some((otherItem : GraphMenuItem) =>
            // @ts-ignore
            otherItem?.childItems.nodes.some(child => child.uri === item.uri))
    );

    return (
        <div
            className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-51 transform [transform:translateZ(0)]", className)}
        >
            <Menu setActive={setActive}>
                {filtertMenuItems.map((item: GraphMenuItem, index: number) => {
                    if (!item.uri) return null;
                    // @ts-ignore
                    const hasChildren = item.childItems?.nodes?.length > 0;
                    return (
                        <MenuItem
                            key={index}
                            setActive={setActive}
                            active={hasChildren ? active : null}
                            item={item.label ?? ""}
                            href={item.uri}
                        >
                            {(() => {
                                const children = item.childItems?.nodes ?? [];

                                const posts = children.filter(
                                    // @ts-ignore
                                    (child: GraphMenuItem) => child?.connectedNode?.node?.__typename === "Post"
                                );

                                const others = children.filter(
                                    // @ts-ignore
                                    (child: GraphMenuItem) => child?.connectedNode?.node?.__typename !== "Post"
                                );

                                return (
                                    <>
                                        {others.length > 0 && (
                                            <div className="flex flex-col space-y-4 text-sm">
                                                {others.map((child: GraphMenuItem, index2: number) => {
                                                    if (!child.uri) return null;
                                                    return (
                                                        <HoveredLink key={index2} href={child.uri}>
                                                            {child.label}
                                                        </HoveredLink>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {posts.length > 0 && (
                                            <div className="text-sm grid grid-cols-2 gap-10 p-4">
                                                {posts.map((child: GraphMenuItem, index2: number) => {
                                                    if (!child.uri) return null;
                                                    // @ts-ignore
                                                    const imageUrl = child?.connectedNode?.node?.featuredImage?.node?.sourceUrl;
                                                    return (
                                                        <ProductItem
                                                            key={index2}
                                                            title={child.label ?? ""}
                                                            href={child.uri}
                                                            src={imageUrl ?? "/fallback-image.jpg"}
                                                            description="Hier könnte deine Beschreibung stehen"
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </MenuItem>
                    )
                })}
                <div className={"max-h-0"}>
                        <DarkmodeToggle
                            checked={darkmode}
                            onCheckedChange={() => setDarkmode(prevState => !prevState)}
                        />
                </div>
            </Menu>
        </div>
    );
}
