import theme from "../app/theme.json";
import {CptStyleAttributes} from '@/types/GraphQL API';

function resolveFontSize (label:string)  {
    const match = theme.settings.typography.fontSizes.find(f => f.slug === label);
    return match?.size;
}

function resolveColor (slug:string)  {
    const match = theme.settings.color.palette.find(c => c.slug === slug);
    return match?.color;
}

export function getFontSizeFromAttributes (attributes :CptStyleAttributes)  {
    if(attributes.fontSize) {
        return resolveFontSize(attributes.fontSize);
    }
    if(attributes.style?.typography) {
        return attributes.style.typography.fontSize;
    }
    return undefined;
}

export function getTextColorFromAttributes (attributes :CptStyleAttributes)  {
    if(attributes.textColor) {
        return resolveColor(attributes.textColor);
    }
    if(attributes.style && attributes.style.color) {
        return attributes.style.color.text;
    }
    return undefined;
}