import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = Object.values(comments).map(comment => {
    let content;
    switch (comment.status) {
      case 'pending':
        content = '(Comment awaiting moderation)';
        break;
      case 'rejected':
        content = '(Comment rejected)';
        break;
      case 'approved':
        content = comment.content;
        break;
      default:
        content = '(Unknown status)';
    }

    return <li key={comment.id}>{content}</li>;
  });

  return (
    <ul>
      {renderedComments}
    </ul>
  );
};

export default CommentList;