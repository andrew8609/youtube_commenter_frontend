import { gql } from '@apollo/client';

const returnData = `
    id
    channel_id {
        title
        id
        thumbnail_image_url
        description
    }
    user_id {
        id
        name
        dob
        profile_image
        followers
    }
    title
    thumbnail_url
    url
    type
    view_count
    like_count
    liked_by
    disliked_by
    dislike_count
    aspect_ratio
    duration
    created_at
    last_updated
`


export const createPost = gql`
        mutation createPost($channel_id: ID, $user_id: ID, $thumbnail_url: String, $title: String, $url: String, $type: String, $view_count: Int, $like_count: Int, $dislike_count: Int, $aspect_ratio: String, $duration: String, $role: String, $posted_as: String, $created_at: String) {
            createPost(channel_id: $channel_id, user_id: $user_id, thumbnail_url: $thumbnail_url, title: $title, url: $url, type: $type, view_count: $view_count, like_count: $like_count, dislike_count: $dislike_count, aspect_ratio: $aspect_ratio, duration: $duration, role: $role, posted_as: $posted_as, created_at: $created_at) {
                ${returnData}
            }
        }
`

export const likeOrDislikePost = gql`
        mutation likeOrDislikePost($id: ID!, $liked_by: ID!, $is_like: Boolean, $is_dislike: Boolean) {
            likeOrDislikePost(id: $id, liked_by: $liked_by, is_like: $is_like, is_dislike: $is_dislike) {
                ${returnData}
            }
        }
    `

export const deletePost = gql`
        mutation deletePost($id: ID!) {
            deletePost(id: $id) {
                ${returnData}
            }
        }
    `