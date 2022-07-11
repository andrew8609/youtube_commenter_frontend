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
        name
        dob
        profile_image
    }
    title
    thumbnail_url
    url
    type
    view_count
    like_count
    dislike_count
    aspect_ratio
    duration
    created_at
    last_updated
`

//Trend Queries
export const getTrends = () => {
    return gql`
        query getTrends($page_no: Int) {
            getTrends(page_no: $page_no) {
                ${returnData}
            }
        }
    `
}