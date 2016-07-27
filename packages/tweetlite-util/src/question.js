const config = [{
	type: 'input',
	name: 'username',
	message: 'Username ?',
	validate(value) {
		let that = null
		if (value && value !== '') {
			that = true
		} else {
			that = 'Do not leave empty'
		}
		return that
	}
},
	{
		type: 'input',
		name: 'consumer_key',
		message: 'Consumer Key ?',
		validate(value) {
			let that = null
			if (value !== '' && value) {
				that = true
			} else {
				that = 'Do not leave empty'
			}
			return that
		}
	},
	{
		type: 'input',
		name: 'consumer_secret',
		message: 'Consumer Secret ?',
		validate(value) {
			if (value === '' && !value) {
				return 'Do not leave empty'
			}
			return true
		}
	},
	{
		type: 'input',
		name: 'access_token',
		message: 'Access Token ?',
		validate(value) {
			if (value === '' && !value) {
				return 'Do not leave empty'
			}
			return true
		}
	},
	{
		type: 'input',
		name: 'access_token_secret',
		message: 'Access Token Secret ?',
		validate(value) {
			let that = null
			if (value !== '' && value) {
				that = true
			} else {
				that = 'Do not leave empty'
			}
			return that
		}
	},
	{
		type: 'list',
		name: 'lang',
		message: 'A certain language ?',
		choices: ['en', 'tr']
	}
]

const search = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
		type: 'input',
		name: 'takip_sayi',
		message: 'Follow limit?',
		validate(value) {
			let that = null
			if (value !== '' && value) {
				if (value <= 700 && value !== 0) {
					that = true
				} else {
					that = 'Tracking the number should not exceed 200'
				}
			} else {
				that = 'Do not leave empty'
			}
			return that
		}
	},
	{
		type: 'list',
		name: 'favorite',
		message: 'Add it to your favorites?',
		choices: ['Yes', 'No']
	},
	{
		type: 'list',
		name: 'lang',
		message: 'Select your language?',
		choices: ['none', 'en', 'tr']
	},
	{
		type: 'list',
		name: 'takip',
		message: 'Let Did you follow?',
		choices: ['Yes', 'No']
	},
	{
		type: 'input',
		name: 'keyword',
		message: 'Search Keyword?',
		validate(value) {
			let that = null
			if (value !== '' && value) {
				that = true
			} else {
				that = 'Do not leave empty'
			}
			return that
		}
	}
]

const watch = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
		type: 'input',
		name: 'keywords',
		message: 'Enter the words ?',
		validate(value) {
			let that = null
			if (value === '' && !value) {
				that = 'Do not leave empty'
			} else {
				that = true
			}
			return that
		}
	},
	{
		type: 'list',
		name: 'lang',
		message: 'Select your language?',
		choices: ['none', 'en', 'tr']
	},
	{
		type: 'list',
		name: 'favorite',
		message: 'Add it to your favorites?',
		choices: ['Yes', 'No']
	},
	{
		type: 'list',
		name: 'follow',
		message: 'Let Did you follow?',
		choices: ['Yes', 'No']
	}
]

const accountlist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account ?'
	}
]

const unfollowlist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account ?'
	},
	{
		type: 'list',
		name: 'type',
		message: 'Can you all users unfollowed?',
		choices: ['Yes', 'No']
	}
]

const messagelist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
		type: 'input',
		name: 'message',
		message: 'Message to Write :'
	},
	{
		type: 'list',
		name: 'send',
		message: 'Are you sure you want to send?',
		choices: ['Yes', 'No']
	}
]
const process = [
	{
		type: 'list',
		name: 'select_pid',
		message: 'Select the bot you want to stop?'
	}
]

export {config, search, watch, accountlist, unfollowlist, process, messagelist}
