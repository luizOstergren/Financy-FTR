import { gql } from '@apollo/client'

export const LIST_CATEGORIES_QUERY = gql`
	query ListCategories {
		listCategoriesByUser {
			id
			name
			description
			color
			icon
			transactionsCount
			createdAt
			updatedAt
		}
	}
`