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

"use client"

import { FormContext } from "@/components/ui/form-elements/ControlledInput";
import {NpContactForm} from "@/types/GraphQL API";
import {prepareHtmlContent} from "@/utils/ParsingHelper";
import React from "react";
import { useState, useCallback } from 'react';
import {FormValues} from "@/types/content";
import {toast} from "sonner";

export type GenericFormProps = {
    cptId: string,
    children: React.ReactNode[]
} & NpContactForm

type FileAttachment = {
    content: string,
    contentType: string,
    filename: string
}

export function GenericForm({npContactForm, cptId, children}: GenericFormProps): JSX.Element {
    const [formValues, setFormValues] = useState<FormValues>([]);
    const emailTemplate = prepareHtmlContent(npContactForm.message);
    const emailFrom = prepareHtmlContent(npContactForm.from);
    const emailTo = prepareHtmlContent(npContactForm.to);
    const emailSubject = prepareHtmlContent(npContactForm.subject);
    const [submitting, setSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [encodetFiles, setEncodetFiles] = useState<FileAttachment[]>([]);

    const handleFileUpload = async (file: File[]) => {
        setFiles(file);

        let encodetAttachmentList = [];
        for (const singleFile of file) {
            const base64 = await fileToBase64(singleFile);
            let encodetAttachment = {
                content: base64,
                contentType: singleFile.type,
                filename: singleFile.name
            };
            encodetAttachmentList.push(encodetAttachment);
        }
        setEncodetFiles(prev => [...prev, ...encodetAttachmentList]);
    };

    const updateFormValue = useCallback((fieldId: string, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        setSubmitting(true);
        e.preventDefault();
        const reqBody = {
            emailDto: {
                emailFrom: emailFrom,
                emailTo: emailTo,
                emailSubject: emailSubject,
                emailTemplate: emailTemplate,
            },
            formValues,
            attachment: encodetFiles
        }

        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqBody),
        }).then(() => {
            toast("Message was sent successfully", {
                description: new Date().toLocaleDateString("de-DE"),
                action: {
                    label: "Close",
                    onClick: () => console.log(""),
                },
            })
            setSubmitting(false);
        });
    }, [formValues, encodetFiles, emailFrom, emailTo, emailSubject, emailTemplate]);

    return (
        <FormContext.Provider value={{ formValues, updateFormValue, submitting, setSubmitting, handleFileUpload }}>
            <form onSubmit={handleSubmit}>
                {children}
            </form>
        </FormContext.Provider>
    );
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload  = () => {
            const dataUrl = reader.result as string;   // "data:text/plain;base64,xxxx"
            resolve(dataUrl.split(',')[1]);            // nur der Base64-Teil
        };
        reader.readAsDataURL(file);
    });
}