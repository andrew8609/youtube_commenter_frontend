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

//Channel Queries
export const getChannels = () => {
    return gql`
        query {
            getChannels {
                ${returnData}
            }
        }
    `
}

export const getFollowingChannels = gql`
    query {
        getFollowingChannels {
            ${returnData}
        }
    }
`

export const getChannelByYoutubeChannelId = gql`
    query getChannelByYoutubeChannelId($id: String){
        getChannelByYoutubeChannelId(id: $id) {
            ${returnData}
        }
    }
`

export const getChannelByUserId = gql`
    query getChannelByUserId($id: String){
        getChannelByUserId(id: $id) {
            ${returnData}
        }
    }
`