import { print } from "graphql/language/printer";
import { ContentNode, Post } from "@/gql/graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import styles from "./PostTemplate.module.css";
import { PostQuery } from "@/queries/general/PostQuery";
import React from "react";

interface TemplateProps {
  node: ContentNode;
}

export default async function PostTemplate({ node }: TemplateProps) {
  const { post } = await fetchGraphQL<{ post: Post }>(print(PostQuery), {
    id: node.databaseId,
  });
  return (
    <div className={`${styles.post} pt-29`}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.author}>By {post.author?.node.name}</div>
      <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </div>
  );
}
