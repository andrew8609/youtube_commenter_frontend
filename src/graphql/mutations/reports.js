import { gql } from '@apollo/client';

const returnData = `
    id
    type
    user_id
    comment_id
    reported_by
    created_at
`

export const createReport = gql`
        mutation createReport($type: String, $user_id: ID, $comment_id: ID, $reported_by: ID) {
            createReport(type: $type, user_id: $user_id, comment_id: $comment_id, reported_by: $reported_by) {
                ${returnData}
            }
        }
    `

export const deleteReport = gql`
    mutation deleteReport($id: ID!) {
        deleteReport(id: $id) {
            ${returnData}
        }
    }
`

