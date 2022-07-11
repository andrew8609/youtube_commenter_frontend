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

export const deleteCrawler = gql`
    mutation deleteCrawler($id: ID!) {
        deleteCrawler(id: $id) {
            ${returnData}
        }
    }
`

