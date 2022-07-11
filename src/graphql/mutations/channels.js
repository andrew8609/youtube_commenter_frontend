import { gql } from '@apollo/client';

const returnData = `
        id
        user_id
        youtube_channel_id
        title
        description
        thumbnail_image_url
        created_at
`

export const createChannel = gql`
        mutation createChannel($title: String, $description: String, $thumbnail_image_url: String, $youtube_channel_id: String, $user_id: String) {
            createChannel(title: $title, description: $description, thumbnail_image_url: $thumbnail_image_url, youtube_channel_id: $youtube_channel_id, user_id: $user_id) {
                ${returnData}
            }
        }
    `

export const deleteChannel = gql`
        mutation deleteChannel($id: ID!) {
            deleteChannel(id: $id) {
                ${returnData}
            }
        }
    `