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

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { print } from "graphql/language/printer";
import { RootQueryToMenuItemConnection } from "@/gql/graphql";
import ClientStyledNavbar from "./ClientStyledNavbar";
import { MenuQuery } from "@/queries/general/MenuQuery";

async function getData() {
    const { menuItems } = await fetchGraphQL<{
        menuItems: RootQueryToMenuItemConnection;
    }>(print(MenuQuery));

    if (!menuItems) {
        throw new Error("Failed to fetch menu items");
    }
    return menuItems;
}

export default async function ServerStyledNavbar({ className }: { className?: string }) {
    const items = await getData();
    return <ClientStyledNavbar menuItems={items} className={className} />;
}