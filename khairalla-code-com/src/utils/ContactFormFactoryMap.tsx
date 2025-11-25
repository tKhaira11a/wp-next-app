import {Label} from "@/components/ui/form-elements/label";
import {fetchGraphQL} from "@/utils/fetchGraphQL";
import {
    GeneralAttributes,
    TextboxDto,
    TextareaDto,
    SwitchDto,
    SelectDto,
    CheckboxDto,
    DatePickerDto,
    RadioGroupDto,
    ButtonDto,
    SelectAttributesDto, RadioGroupAttributesDto, FileUploadDto
} from "@/types/GraphQL API";
import {print} from "graphql/language/printer";
import {parseStyleString} from "@/utils/ParsingHelper";
import {TextboxQuery} from "@/queries/CPTs/form-elements/textbox";
import {TextareaQuery} from "@/queries/CPTs/form-elements/textarea";
import {SwitchQuery} from "@/queries/CPTs/form-elements/switch";
import {SelectQuery} from "@/queries/CPTs/form-elements/select";
import {RadioGroupQuery} from "@/queries/CPTs/form-elements/radio-group";
import {DatePickerQuery} from "@/queries/CPTs/form-elements/date-picker";
import {CheckboxQuery} from "@/queries/CPTs/form-elements/checkbox";
import { ButtonQuery } from "@/queries/CPTs/button";
import {ControlledInput} from "@/components/ui/form-elements/ControlledInput";
import {FileUploadQuery} from "@/queries/CPTs/form-elements/file-upload";

export const contactFormFactoryMap: Record<string,(id: string) => Promise<JSX.Element>> = {
    "Textbox": async (id: string): Promise<JSX.Element> => {
        const {textbox} = await fetchGraphQL<TextboxDto>(
            print(TextboxQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(textbox?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");
        return (
            <div style={styles} className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {textbox.label}
                </Label>
                <ControlledInput fieldName={parsedAttrs.fieldName} cptId={parseInt(id)} label={textbox.label} type={"Textbox"} styles={styles} />
            </div>
        );
    },
    "Textarea": async (id: string): Promise<JSX.Element> => {
        const {textarea} = await fetchGraphQL<TextareaDto>(
            print(TextareaQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(textarea?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");

        return (
            <div style={styles} className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {textarea.label}
                </Label>
                <ControlledInput fieldName={parsedAttrs.fieldName} cptId={parseInt(id)} label={textarea.label} type={"Textarea"} styles={styles} />
            </div>
        );
    },
    "Button": async (id: string): Promise<JSX.Element> => {
        const data = await fetchGraphQL<ButtonDto>(
            print(ButtonQuery),
            {id: id}
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.button.attributes);
        const styles = parseStyleString(parsedAttrs.style?.css ?? "");
        return (
            <div className={parsedAttrs?.className}>
                <ControlledInput fieldName={parsedAttrs.fieldName} url={data.button.url} cptId={parseInt(id)} label={data.button.label} type={"Button"} styles={styles} />
            </div>
        )
    },
    "Switch": async (id: string): Promise<JSX.Element> => {
        const  data  = await fetchGraphQL<SwitchDto>(
            print(SwitchQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(data.switch?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");

        return (
            <div style={styles} className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {data.switch.label}
                    <ControlledInput fieldName={parsedAttrs.fieldName} cptId={parseInt(id)} label={data.switch.label} type={"Switch"} styles={styles} />
                </Label>
            </div>
        );
    },
    "Select": async (id: string): Promise<JSX.Element> => {
        const {select} = await fetchGraphQL<SelectDto>(
            print(SelectQuery),
            { id: id }
        );
        let parsedAttrs: SelectAttributesDto = JSON.parse(select?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");

        return (
            <div className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {select.label}
                </Label>
                <ControlledInput fieldName={parsedAttrs.fieldName} cptId={parseInt(id)} label={select.label} type={"Select"} options={parsedAttrs.selectValues} styles={styles} />
            </div>
        );
    },
    "RadioGroup": async (id: string): Promise<JSX.Element> => {
        const {radioGroup} = await fetchGraphQL<RadioGroupDto>(
            print(RadioGroupQuery),
            { id: id }
        );
        let parsedAttrs: RadioGroupAttributesDto = JSON.parse(radioGroup?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");
        return (
            <div style={styles} className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {radioGroup.label}
                </Label>
                <br/>
                <ControlledInput fieldName={parsedAttrs.fieldName} cptId={parseInt(id)} label={radioGroup.label} type={"RadioGroup"} styles={styles} options={parsedAttrs.radioOptions} />
            </div>
        );
    },
    "DatePicker": async (id: string): Promise<JSX.Element> => {
        const {datePicker} = await fetchGraphQL<DatePickerDto>(
            print(DatePickerQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(datePicker?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");
        return (
            <div style={styles} className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {datePicker?.label ?? ""}
                </Label>
                <ControlledInput fieldName={parsedAttrs?.fieldName} cptId={parseInt(id)} label={datePicker?.label} type={"DatePicker"} styles={styles} />
            </div>
        );
    },
    "Checkbox": async (id: string): Promise<JSX.Element> => {
        const {checkbox} = await fetchGraphQL<CheckboxDto>(
            print(CheckboxQuery),
            { id: id }
        );
        let parsedAttrs: GeneralAttributes = JSON.parse(checkbox?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");
        return (
            <div style={styles} className={parsedAttrs?.className}>
                <Label htmlFor="airplane-mode">
                    {checkbox.label}
                    <ControlledInput fieldName={parsedAttrs.fieldName} cptId={parseInt(id)} label={checkbox.label} type={"Checkbox"} styles={styles} />
                </Label>
            </div>
        );
    },
    "FileUpload": async (id: string): Promise<JSX.Element> => {
        const {fileUpload} = await fetchGraphQL<FileUploadDto>(
            print(FileUploadQuery),
            { id: id }
        );

        let parsedAttrs: GeneralAttributes = JSON.parse(fileUpload?.attributes ?? "{}");
        const styles = parseStyleString(parsedAttrs.style?.css ?? "{}");

        return (
            <div style={styles} className={parsedAttrs?.className}>
                <ControlledInput fieldName={fileUpload.fieldName} cptId={parseInt(id)} label={fileUpload.label} subLabel={fileUpload.subLabel} type={"FileUpload"} />
            </div>
        )
    }
}