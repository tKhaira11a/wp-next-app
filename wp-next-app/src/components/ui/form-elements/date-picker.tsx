"use client"

import * as React from "react"
import {format} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/form-elements/Button"
import {Calendar} from "@/components/ui/form-elements/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/form-elements/popover"


type DatePickerProps = {
    cptId?: number,
    fieldName?: string,
    updateFormValue: (fieldId: string, value: any) => void,
}

export function DatePicker({cptId, fieldName, updateFormValue}: DatePickerProps): JSX.Element {
    const [date, setDate] = React.useState<Date>();

    function extendetSetDate(value: any) {
        let newDate = new Date(value);
        setDate(newDate);
        const dateOnly = new Date(value.getFullYear(), value.getMonth(), value.getDate());
        const day = String(dateOnly.getDate()).padStart(2, '0');
        const month = String(dateOnly.getMonth() + 1).padStart(2, '0');
        const year = dateOnly.getFullYear();
        const europeanDate = `${day}-${month}-${year}`;
        updateFormValue("DatePicker_"+fieldName?.toString(), europeanDate);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? format(date, "PP") : <span>Datum wählen</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    defaultMonth={date}
                    selected={date}
                    onSelect={extendetSetDate}
                    captionLayout={"dropdown"}
                    className="rounded-lg border shadow-sm"
                />
            </PopoverContent>
        </Popover>
    )
}