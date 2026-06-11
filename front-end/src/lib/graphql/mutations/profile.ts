import { gql } from '@apollo/client'

export const PROFILE_MUTATION = gql`
	mutation Profile($data: EditUserInput!) {
		editUser(data: $data) {
			id
			name
			email
			createdAt
			updatedAt
		}
	}
`