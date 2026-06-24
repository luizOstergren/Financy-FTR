import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS_QUERY = gql`
	query ListTransactions {
		listTransactionsByUser {
			id
			amount
			description
			date
			createdAt
			updatedAt
			category {
				id
				name
				color
				icon
			}
		}
	}
`