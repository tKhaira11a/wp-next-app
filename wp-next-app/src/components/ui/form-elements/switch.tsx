/*
 *  Copyright (C) 2026 Tarik Khairalla (khairalla-code)
 *   https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

"use client"
import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import {cn} from "@/lib/utils"
import {createContext, useContext} from "react";
import {FormValues} from "@/types/content";


type SwitchProps = {
    cptId: number
} & React.ComponentProps<typeof SwitchPrimitive.Root>

const FormContext = createContext<{
    formValues: FormValues;
    updateFormValue: (fieldId: string, value: any) => void;
}>({
    formValues: {
        fieldId: "",
        value: undefined
    },
    updateFormValue: () => {}
});

function ControlledSwitch({ cptId }: { cptId: number }) {
    const { formValues, updateFormValue } = useContext(FormContext);
    const fieldId = `Switch_${cptId}`;

    return (
        <Switch
            cptId={cptId}
            // @ts-ignore
            checked={formValues[fieldId] || false}
            onCheckedChange={(checked) => updateFormValue(fieldId, checked)}
        />
    );
}

function Switch(
    {
        className,
        cptId,
        ...props
    }: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
                )}
            />
        </SwitchPrimitive.Root>
    )
}

export {Switch, ControlledSwitch}
