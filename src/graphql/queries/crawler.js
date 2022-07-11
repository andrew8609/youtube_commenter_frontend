import { gql } from '@apollo/client';

// const returnData = `
//     id
//     type
//     total_posts
//     created_at
// `
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
    role
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

//Crawling data Queries
export const getCrawlerData = gql`
        query {
            getCrawlerData {
                ${returnData}
            }
        }
    `

export const getCrawledNormalData = gql`
    query {
        getCrawledNormalData {
            ${returnData}
        }
    }
`

export const getCrawledTrendingData = gql`
    query {
        getCrawledTrendingData {
            ${returnData}
        }
    }
`

export const getFollowingCrawledData = () => {
    return gql`
        query getFollowingCrawledData($page_no: Int, $search: String) {
            getFollowingCrawledData(page_no: $page_no, search: $search) {
                ${returnData}
            }
        }
`
}

export const getCrawledPostByYoutubeId = gql`
    query getCrawledPostByYoutubeId($id: String) {
        getCrawledPostByYoutubeId(id: $id) {
            ${returnData}
        }
    }
`