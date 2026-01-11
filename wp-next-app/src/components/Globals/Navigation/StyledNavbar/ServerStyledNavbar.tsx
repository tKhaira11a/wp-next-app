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