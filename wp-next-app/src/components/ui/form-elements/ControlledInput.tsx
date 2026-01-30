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

import {Input} from "@/components/ui/form-elements/input";
import {Textarea} from "@/components/ui/form-elements/textarea";
import { Switch} from "@/components/ui/form-elements/switch";
import {Select} from "@/components/ui/form-elements/select";
import {DatePicker} from "@/components/ui/form-elements/date-picker";
import {Checkbox} from "@/components/ui/form-elements/checkbox";
import {Label} from "@/components/ui/form-elements/label";
import {Button} from "@/components/ui/form-elements/Button";
import {SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/form-elements/select";
import {RadioGroup, RadioGroupItem} from "@/components/ui/form-elements/radio-group";
import {createContext, CSSProperties, useContext} from "react";
import {FormValues} from "@/types/content";
import Link from "next/link";
import {FileUpload} from "@/components/ui/form-elements/file-upload";

type ControlledInputProps = {
    fieldName?: string;
    cptId: number;
    type: string;
    label: string;
    subLabel?: string;
    styles?:  CSSProperties;
    options?: any[];
    url?: string;
};

export const FormContext = createContext<{
    formValues: FormValues;
    updateFormValue: (fieldId: string, value: any) => void;
    submitting: boolean;
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    handleFileUpload: (files: File[]) => void;
}>({
    formValues: {
        fieldId: "",
        value: undefined
    },
    updateFormValue: () => {},
    submitting: false,
    setSubmitting: () => {},
    handleFileUpload: () => {},
});

export function ControlledInput({ cptId, type, label, subLabel, options, styles, url, fieldName }: ControlledInputProps) {
    const { formValues, updateFormValue, submitting, handleFileUpload } = useContext(FormContext);
    const fieldId = `${type}_${fieldName}`;

    const handleChange = (value: any) => {
        updateFormValue(fieldId, value);
    };


    switch (type) {
        case 'Switch':
            return (
                <Switch
                    cptId={cptId}
                    checked={formValues[fieldId] || false}
                    onCheckedChange={(e) => handleChange(e.valueOf())}
                />
            );
        case 'Select':
            return (
                <Select value={formValues[fieldId]} onValueChange={(e) => handleChange(e.valueOf())} cptId={cptId}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent style={styles} >
                        <SelectGroup>
                            <SelectLabel>{label}</SelectLabel>
                            {options?.map((item, index) => {
                                return (
                                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                )
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            );
        case 'Textbox':
            return (
                <Input
                    cptId={cptId}
                    type="text"
                    value={formValues[fieldId] || ""}
                    onChange={(e) => handleChange(e.target.value)}
                />
            );
        case 'Checkbox':
            return (
                <Checkbox
                    checked={formValues[fieldId] || false}
                    cptId={cptId}
                    onCheckedChange={(e) => handleChange(!formValues[fieldId])}
                >
                </Checkbox>
            )
        case 'Textarea':
            return (
                    <Textarea
                        onChange={(e) => handleChange(e.target.value)}
                        cptId={cptId}
                        placeholder="Type your message here."
                        value={formValues[fieldId] || ""}
                    >
                    </Textarea>)
        case 'RadioGroup':
            return (
                <div>
                    <RadioGroup cptId={cptId} defaultValue="comfortable" value={formValues[fieldId]} onValueChange={(e) => handleChange(e.valueOf())}>
                        {options?.map((item, index) => {
                            return (
                                <div key={item.value} className="flex items-center gap-3">
                                    <RadioGroupItem value={item.value} id={item.value} />
                                    <Label htmlFor="r1">{item.label}</Label>
                                </div>
                            )

                        })}
                    </RadioGroup>
                </div>
            )
        case 'DatePicker':
            return (<DatePicker fieldName={fieldName} updateFormValue={updateFormValue} cptId={cptId} ></DatePicker>)
        case 'Button':

            if(url && url !== "") {
                return (
                    <Button style={styles} type={"submit"} disabled={submitting}>
                        <Link
                            style={ styles}
                            href={url ?? ""}>{label}
                        </Link>
                    </Button>
                )
            }else{
                return (
                    <Button style={styles} type={"submit"} disabled={submitting}>
                        {label}
                    </Button>
                )
            }
        case 'FileUpload':
            return (
                <FileUpload onChange={handleFileUpload} label={label} subLabel={subLabel ?? "Drag & Drop or press Button to select File"}/>
            );
        default:
            return null;
    }
}
