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

"use server"

import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { emailDto, formValues, attachment } = req.body;
    const transformedObj = Object.entries(formValues).reduce((acc, [key, value]) => {
        const parts = key.split('_');
        const type = parts[0];
        const id = parts[1];
        const formattedValue = typeof value === 'boolean' ? String(value) : value;
        // @ts-ignore
        acc[id] = {
            type: type,
            value: formattedValue
        };
        return acc;
    }, {});

    // @ts-ignore
    const replacedEmailTemplate = emailDto.emailTemplate.replace(/\{([\w-]+)\}/g, (match, id) => {
        // @ts-ignore
        if (transformedObj[id]) {
            // @ts-ignore
            return transformedObj[id].value;
        } else {
            return match;
        }
    });

    try {
        const data = await resend.emails.send({
            from: 'Khairalla-code <noreply@khairalla-code.com>',
            to: [emailDto.emailTo],
            subject: emailDto.emailSubject,
            replyTo: emailDto.emailFrom,
            html: replacedEmailTemplate,
            attachments: attachment,
        });

        return res.status(200).json({ success: true, id: data.data?.id, message: "E-Mail erfolgreich versendet!" });
    } catch (error) {
        console.error("Fehler beim Versenden:", error);
        return res.status(500).json({ success: false, error, message: "Fehler beim Versenden der E-Mail" });
    }
}
