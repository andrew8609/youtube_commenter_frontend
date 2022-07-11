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

export const deleteTrend = gql`
        mutation deleteTrend($id: ID!) {
            deleteTrend(id: $id) {
                ${returnData}
            }
        }
    `