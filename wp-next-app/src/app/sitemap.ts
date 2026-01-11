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

import { MetadataRoute } from "next";

export const revalidate = 0;

async function getTotalCounts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/sitemap/v1/totalpages`,
  );
  const data = await response.json();
  if (!data) return [];
  const propertyNames = Object.keys(data);

  const excludeItems = ["page", "user", "category", "tag"];
  let totalArray = propertyNames
    .filter((name) => !excludeItems.includes(name))
    .map((name) => {
      return { name, total: data[name] };
    });

  return totalArray;
}

async function getPostsUrls({
  page,
  type,
  perPage,
}: {
  page: number;
  type: string;
  perPage: number;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/sitemap/v1/posts?pageNo=${page}&postType=${type}&perPage=${perPage}`,
  );

  const data = await response.json();

  if (!data) return [];

  const posts = data.map((post: any) => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${post.url}`,
      lastModified: new Date(post.post_modified_date)
        .toISOString()
        .split("T")[0],
    };
  });

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap = [];

  const details = await getTotalCounts();

  const postsUrls = await Promise.all(
    details.map(async (detail) => {
      const { name, total } = detail;
      const perPage = 50;
      const totalPages = Math.ceil(total / perPage);

      const urls = await Promise.all(
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
          getPostsUrls({ page, type: name, perPage }),
        ),
      );

      return urls.flat();
    }),
  );

  const posts = postsUrls.flat();

  sitemap.push(...posts);

  return sitemap;
}
