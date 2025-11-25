import {GeneralAttributes} from "@/types/GraphQL API";

export type ParticalCanvasOptions = {
    node?: {
        particleColor: string,
        background: {
            node: {
                filePath: string,
            }
        },
        interactive: boolean,
        speed: string,
        density: string
    }
}

export type ParticalCanvasBlockOptions = {
        particalCanvas: {
            density: string,
            particleColor: string,
            speed: string,
            background: string,
            interactive: boolean,
            childIds: string,
            childContent: string,
            attributes: string,
        }
}