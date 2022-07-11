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

export const getCommentsByPostID = gql`
        query getCommentsByPostID($id: ID!, $skip: Int!, $limit: Int!) {
            getCommentsByPostID(id: $id, skip: $skip, limit: $limit) {
                ${returnData}
            }
        }
    `

export const getCommentsByUser = gql`
    query getCommentsByUser($id: ID!) {
        getCommentsByUser(id: $id) {
            ${returnData}
        }
    }
`

export const getFollowingReactions = () => {
    return gql`
        query getFollowingReactions($page_no: Int) {
            getFollowingReactions(page_no: $page_no) {
                ${returnData}
            }
        }
    `
}

export const getCommentsCount = () => {
    return gql`
        query getCommentsCount($id: ID) {
            getCommentsCount(id: $id) {
                count
            }
        }
    `
}