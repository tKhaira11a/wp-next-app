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