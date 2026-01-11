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

import { print } from "graphql/language/printer";

import { ContentNode, LoginPayload } from "@/gql/graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { NextResponse } from "next/server";
import gql from "graphql-tag";
import {draftMode} from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const id = searchParams.get("id");

  if (secret !== process.env.HEADLESS_SECRET || !id) {
    return new Response("Invalid token", { status: 401 });
  }

  const mutation = gql`
  mutation LoginUser {
    login( input: {
      clientMutationId: "uniqueId",
      username: "${process.env.WP_USER}",
      password: "${process.env.WP_APP_PASS}"
    } ) {
      authToken
      user {
        id
        name
      }
    }
  }
`;

  const { login } = await fetchGraphQL<{ login: LoginPayload }>(
    print(mutation),
  );

  const authToken = login.authToken;
  (await draftMode()).enable();
  const query = gql`
    query GetContentNode($id: ID!) {
      contentNode(id: $id, idType: DATABASE_ID) {
        uri
        status
        databaseId
      }
    }
  `;

  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(query),
    {
      id,
    },
    { Authorization: `Bearer ${authToken}` },
  );

  if (!contentNode) {
    return new Response("Invalid id", { status: 401 });
  }

  const response = NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}${
      contentNode.status === "draft"
        ? `/preview/${contentNode.databaseId}`
        : contentNode.uri
    }`,
  );

  response.headers.set("Set-Cookie", `wp_jwt=${authToken}; path=/;`);

  return response;
}
