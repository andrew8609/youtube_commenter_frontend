import { gql } from '@apollo/client';

const returnData = `
    id
    name
    dob
    email
    password
    profile_image
    followers
    following
    is_activated
    is_verified
    last_signed_ip
    last_signed_date
    view_count
    updated_at
    created_at
`

//User Queries
export const getUsers = () => {
    return gql`
        query {
            getUsers {
                ${returnData}
            }
        }
    `
}

export const getUser = gql`
        query getUser($id: ID!) {
            getUser(id: $id) {
                ${returnData}
            }
        }
    `

export const getUserByEmail = gql`
    query getUserByEmail($email: String) {
        getUserByEmail(email: $email) {
            ${returnData}
        }
    }
`

// export const getUser = () => {
//     return gql`
//         query getUser($id: ID) {
//             getUser(id: $id) {
//                 ${returnData}
//             }
//         }
//     `
// }

export const getCurrentUser = () => {
    return gql`
        query {
            getCurrentUser {
                ${returnData}
            }
        }
    `
}