import { gql } from '@apollo/client'

export const CREATE_TRANSACTION_MUTATION = gql`
	mutation CreateTransaction($data: CreateTransactionInput!) {
		createTransaction(data: $data) {
			id
			amount
			description
			date
			createdAt
			updatedAt
			category {
				id
				name
				description
				icon
				color
				createdAt
				updatedAt
			}
		}
	}
`

export const DELETE_TRANSACTION_MUTATION = gql`
	mutation DeleteTransaction($deleteTransactionId: String!) {
		deleteTransaction(id: $deleteTransactionId)
	}
`

export const UPDATE_TRANSACTION_MUTATION = gql`
	mutation EditTransaction($data: EditTransactionInput!) {
		editTransaction(data: $data) {
			id
			amount
			description
			date
			createdAt
			updatedAt
			category {
				id
				name
				description
				icon
				color
				createdAt
				updatedAt
			}
		}
	}
`