import { gql } from '@apollo/client'

export const CREATE_CATEGORY_MUTATION = gql`
	mutation CreateCategory($data: CreateCategoryInput!) {
		createCategory(data: $data) {
			id
			name
			description
			icon
			color
			createdAt
			updatedAt
		}
	}
`

export const UPDATE_CATEGORY_MUTATION = gql`
	mutation EditCategory($data: EditCategoryInput!) {
		editCategory(data: $data) {
			id
			name
			description
			icon
			color
			createdAt
			updatedAt
		}
	}
`

export const DELETE_CATEGORY_MUTATION = gql`
	mutation DeleteCategory($deleteCategoryId: String!) {
		deleteCategory(id: $deleteCategoryId)
	}
`