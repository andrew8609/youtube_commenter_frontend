import { gql } from '@apollo/client';

const returnData = `
    id
    post_id {
        id
        thumbnail_url
        title
        url
        type
        view_count
        like_count
        dislike_count
        aspect_ratio
        role
        liked_by
        disliked_by
        duration
        created_at
        last_updated
    }
    comment_by
    like_count
    liked_by
    url
    type
    note
    aspect_ratio
    duration
    created_at
    updated_at
    note
`


export const createComment = gql`
        mutation createComment($post_id: ID!, $videos: [VideoBlobs], $totalDuration: Int, $type:String!) {
            createComment(post_id: $post_id, videos: $videos, totalDuration: $totalDuration, type :$type) {
                ${returnData}
            }
        }
    `

export const deleteComment = gql`
    mutation deleteComment($id: ID!) {
        deleteComment(id: $id) {
            ${returnData}
        }
    }
`
export const likeOrUnlikeComment = gql`
        mutation likeOrUnlikeComment($id: ID!, $liked_by: ID!, $is_like: Boolean!) {
            likeOrUnlikeComment(id: $id, liked_by: $liked_by, is_like: $is_like) {
                ${returnData}
            }
        }
    `