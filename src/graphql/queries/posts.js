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

//Post Queries
export const getPosts = () => {
    return gql`
        query getPosts($page_no: Int, $search: String, $posted_as: String) {
            getPosts(page_no: $page_no, search: $search, posted_as: $posted_as) {
                ${returnData}
            }
        }
    `
}

export const getFollowingPosts = () => {
    return gql`
        query getFollowingPosts($page_no: Int, $search: String) {
            getFollowingPosts(page_no: $page_no, search: $search) {
                ${returnData}
            }
        }
`
}

export const getPost = gql`
    query getPost($id: String) {
        getPost(id: $id) {
            ${returnData}
        }
    }
`

export const getPostByYoutubeId = gql`
    query getPostByYoutubeId($id: String) {
        getPostByYoutubeId(id: $id) {
            ${returnData}
        }
    }
`

export const getPostsByChannel = gql`
        query getPostsByChannel($id: String!) {
            getPostsByChannel(id: $id) {
                ${returnData}
            }
        }
    `

export const getPostsByUser = gql`
        query getPostsByUser($id: ID!) {
            getPostsByUser(id: $id) {
                ${returnData}
            }
        }
`