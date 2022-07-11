import { gql } from '@apollo/client';

const returnData = `
    id
    is_on
`

//Crawling status Queries
export const getCrawlerStatus = gql`
        query {
            getCrawlerStatus {
                ${returnData}
            }
        }
    `