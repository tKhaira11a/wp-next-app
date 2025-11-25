"use client";
import {ParticleCanvasInit} from "@/lib/particle-network"
import React, {useEffect} from "react";
import {ParticalCanvasBlockOptions, ParticalCanvasOptions} from "@/types/components/particalCanvasOptions";

export default function ParticalCanvas({
                                           particalCanvasOptions,
                                           particalCanvasBlockOptions,
                                           children,
                                       }: {
    particalCanvasOptions?: ParticalCanvasOptions;
    particalCanvasBlockOptions?: ParticalCanvasBlockOptions;
    children?: React.ReactNode;
}) {
    // @ts-ignore
    let options = {};
    let background: string = "";
    if(particalCanvasOptions) {
        background = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? "";
        background += particalCanvasOptions.node?.background.node.filePath;
        options = {
            particleColor: particalCanvasOptions.node?.particleColor,
            background: background,
            interactive: particalCanvasOptions.node?.interactive,
            speed: particalCanvasOptions.node?.speed,
            density: particalCanvasOptions.node?.density
        }
    }
    if(particalCanvasBlockOptions) {
        background = particalCanvasBlockOptions.particalCanvas.background;
        options = {
            particleColor: particalCanvasBlockOptions.particalCanvas.particleColor,
            background: background,
            interactive: particalCanvasBlockOptions.particalCanvas.interactive,
            speed: particalCanvasBlockOptions.particalCanvas.speed,
            density: particalCanvasBlockOptions.particalCanvas.density
        }
    }

    useEffect(() => {
        const canvasDiv = document.getElementById('particle-canvas');
        ParticleCanvasInit(canvasDiv, options);
    }, []);
    return (
        <>
            <div id="particle-canvas">
                {children}
            </div>


            <style jsx>{`
                #particle-canvas {
                    height: inherit;
                    width: 100%;
                    left: 0;
                    
                }
            `}</style>
        </>
    );
}