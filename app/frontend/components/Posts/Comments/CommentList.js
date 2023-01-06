import React, { useState, useEffect } from "react";
import IndividualComment from "./IndividualComment";
const CommentList = ({
  comments,
  reload,
  setReload,
  allComments,
  post_id,
  phone,
}) => {
  return comments.map((item) => (
    <IndividualComment
      commentId={item.id}
      userId={item.attributes.user_id}
      content={item.attributes.content}
      createdAt={item.attributes.created_at}
      comment_likes={item.relationships.like_comments.data.length}
      reload={reload}
      setReload={setReload}
      post_id={post_id}
      allComments={allComments}
      phone={phone}
      comment_likes_data={item.relationships.like_comments.data}
    />
  ));
};

export default CommentList;
