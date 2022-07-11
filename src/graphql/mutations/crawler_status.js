import { gql } from '@apollo/client';

const returnData = `
    id
    is_on
`

export const updateCrawlerStatus = gql`
    mutation updateCrawlerStatus($is_on: Boolean) {
        updateCrawlerStatus(is_on: $is_on) {
            ${returnData}
        }
    }
`

