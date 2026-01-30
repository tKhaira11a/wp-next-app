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

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import ServerStyledNavbar from "@/components/Globals/Navigation/StyledNavbar/ServerStyledNavbar";
import {fetchGraphQL} from "@/utils/fetchGraphQL";
import {print} from "graphql/language/printer";
import {AdditionalCSSQuery} from "@/queries/general/StylesQuery";
import { Toaster } from "@/components/ui/sonner"
import {draftMode} from "next/headers";
import {PreviewNotice} from "@/components/Globals/PreviewNotice/PreviewNotice";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default async function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
    const {additionalCSS} = await fetchGraphQL(
        print(AdditionalCSSQuery)
    );
    const { isEnabled } = await draftMode();
    return (
        <html lang="de">
          <body
              className={`${geistSans.variable} ${inter.className} ${geistMono.variable} antialiased dark`}
          >
          {isEnabled && <PreviewNotice />}
              <style
                  dangerouslySetInnerHTML={{
                      __html: additionalCSS,
                  }}
              />
            <ServerStyledNavbar />
            {children}
            <Toaster />
          </body>
        </html>
    );
}
