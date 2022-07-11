import { gql } from '@apollo/client';

const returnData = `
    id
    type
    user_id
    comment_id
    reported_by
    created_at
`

//Report Queries
export const getReports = () => {
    return gql`
        query {
            getReports {
                ${returnData}
            }
        }
    `
}