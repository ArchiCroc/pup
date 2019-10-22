import React from 'react';
import PropTypes from 'prop-types';
import CommentComposer from './CommentComposer';
import { timeago } from '../../../modules/dates';

import { StyledComments, CommentsList, CommentsListHeader, Comment } from './StyledComments';

const Comments = ({ sortBy, onChangeSortBy, documentId, comments }) => (
  <StyledComments>
    <CommentComposer documentId={documentId} />
    {comments.length > 0 && (
      <CommentsList>
        <CommentsListHeader>
          <h3>{comments.length === 1 ? '1 Comment' : `${comments.length} Comments`}</h3>
          <select name="sortBy" className="form-control" value={sortBy} onChange={onChangeSortBy}>
            <option value="newestFirst">Newest First</option>
            <option value="oldestFirst">Oldest First</option>
          </select>
        </CommentsListHeader>
        {comments.map(({ _id, user, createdAt, comment }) => (
          <Comment key={_id}>
            <header>
              <p>
                <strong>
                  {user.profile.firstName} {user.profile.lastName}
                </strong>
                <span>{timeago(createdAt)}</span>
              </p>
            </header>
            <div>
              {comment.split('\n').map((item, key) => (
                <p key={`${_id}_${key}` /* eslint-disable-line */}>{item}</p>
              ))}
            </div>
          </Comment>
        ))}
      </CommentsList>
    )}
  </StyledComments>
);

Comments.propTypes = {
  documentId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  onChangeSortBy: PropTypes.func.isRequired,
};

export default Comments;
