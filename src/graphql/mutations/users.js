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

export const activateUser = gql`
        mutation activateUser($token: String) {
            activateUser(token: $token) {
                ${returnData}
            }
        }
`

export const registerUser = gql`
        mutation registerUser($name: String, $dob: String, $email: String, $is_activated: Boolean, $is_verified: Boolean, $password: String, $base64: String, $fileName: String, $fileType: String, $role: String) {
            registerUser(name: $name, dob: $dob, email: $email, password: $password, is_activated: $is_activated, is_verified: $is_verified, base64: $base64, fileName: $fileName, fileType: $fileType, role: $role) {
                ${returnData}
            }
        }
`

export const loginUser = gql`
        mutation loginUser($email: String!, $password: String!, $role: String!) {
            loginUser(email: $email, password: $password, role: $role) {
                token
                role
                name
                user_id,
                profile_image
            }
        }
    `

export const deleteUser = gql`
        mutation deleteUser($id: ID!) {
            deleteUser(id: $id) {
                ${returnData}
            }
        }
    `

export const updateUser = gql`
        mutation updateUser($name: String, $dob: String, $email: String, $base64: String, $fileName: String, $fileType: String) {
            updateUser(name: $name, dob: $dob, email: $email, base64: $base64, fileName: $fileName, fileType: $fileType) {
                ${returnData}
            }
        }
`

export const userFollow = gql`
        mutation followUser($id: ID!) {
            followUser(id: $id) {
                ${returnData}
            }
        }
    `

export const updateViewCount = gql`
        mutation updateViewCount($id: ID!) {
            updateViewCount(id: $id) {
                ${returnData}
            }
        }
`

export const changePassword = gql`
        mutation changePassword($old_password: String!, $password: String!, $email: String!) {
            changePassword(old_password: $old_password, password: $password, email: $email) {
                ${returnData}
            }
        }
`

export const resetPassword = gql`
        mutation resetPassword($email: String) {
            resetPassword(email: $email) {
                ${returnData}
            }
        }
`

export const passwordReset = gql`
        mutation passwordReset($password: String!, $token: String!) {
            passwordReset(password: $password, token: $token) {
                ${returnData}
            }
        }
`