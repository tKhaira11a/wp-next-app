import {RootQueryToMenuItemConnection} from "@/gql/graphql";

export type StyledNavbarProps = {
    className?: string;
    menuItems: RootQueryToMenuItemConnection;
};