exports.config = [
{
	type: 'input',
	name: 'username',
	message: 'Username ?',
	validate: function( value ) {
		var that = null;
		if (value !== '' && value) {
			that = true;
		} else {
			that = 'Do not leave empty';
		}
		return that;
	}
},
{
	type: 'input',
	name: 'Consumer_Key',
	message: 'Consumer Key ?',
	validate: function( value ) {
		var that = null;
		if (value !== '' && value) {
			that = true;
		} else {
			that = 'Do not leave empty';
		}
		return that;
	}
},
{
	type: 'input',
	name: 'Consumer_Secret',
	message: 'Consumer Secret ?',
	validate: function( value ) {
		var that = null;
		if (value !== '' && value) {
			return true;
		} else {
			return 'Do not leave empty';
		}
	}
},
{
	type: 'input',
	name: 'Access_Token',
	message: 'Access Token ?',
	validate: function( value ) {

		if (value !== '' && value) {
			return true;
		} else {
			return 'Do not leave empty';
		}
	}
},
{
	type: 'input',
	name: 'Access_Token_Secret',
	message: 'Access Token Secret ?',
	validate: function (value) {
		var that = null;
		if (value !== '' && value) {
			that = true;
		} else {
			that = 'Do not leave empty';
		}
		return that;
	}
},
{
	type: 'input',
	name: 'lang',
	message: 'A certain language ?',
	default: ['tr','en'],
	validate: function (value) {
		var that = null;
		if (value !== '' && value && value.length >= 2) {
			that = true;
		} else {
			that = 'Do not leave empty';
		}
		return that;
	}
}
];

exports.start = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
		type: 'input',
		name: 'takip_sayi',
		message: 'Follow limit?',
		validate: function (value) {
			var that = null;
			if (value !== '' && value) {
				if (value <= 200) {
					that = true;
				} else {
					that = 'Tracking the number should not exceed 200';
				}
			} else {
				that = 'Do not leave empty';
			}
			return that;
		}
	},
	{
    type: "list",
    name: "favorite",
    message: "Add it to your favorites?",
    choices: [ "Yes", "No"]
  	},
  	{
    type: "list",
    name: "takip",
    message: "Let Did you follow?",
    choices: [ "Yes", "No"]
  	},
  	{
		type: 'input',
		name: 'keyword',
		message: 'Search Keyword?',
		validate: function( value ) {
			var that = null;
			if (value !== '' && value) {
				that = true;
			} else {
				that = 'Do not leave empty';
			}
			return that;
		}
	}
];

exports.blacklist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
		type: 'input',
		name: 'blacklist_username',
		message: 'Enter the User Name ?',
		validate: function (value) {
			var that = null;
			if (value === '' && !value) {
				that = 'Do not leave empty';
			} else {
				that = true;
			}
			return that;
		}
	}
];

exports.live = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
		type: 'input',
		name: 'keywords',
		message: 'Enter the words ?',
		validate: function (value) {
			var that = null;
			if (value === '' && !value) {
				that = 'Do not leave empty';
			} else {
				that = true;
			}
			return that;
		}
	},
	{
    type: "list",
    name: "favorite",
    message: "Add it to your favorites?",
    choices: [ "Yes", "No"]
  	},
  	{
    type: "list",
    name: "takip",
    message: "Let Did you follow?",
    choices: [ "Yes", "No"]
  	}
];


exports.accountlist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account ?'
	}
];



exports.messagelist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Select account?'
	},
	{
	type: 'input',
	name: 'limit',
	message: 'Enter the user limit:'
	},
	{
		type: 'input',
		name: 'message',
		message: 'Message to Write :'
	},
	{
   type: "list",
   name: "send",
   message: "Are you sure you want to send?",
   choices: [ "Yes", "No"]
  }
];
exports._process = [
	{
		type: 'list',
		name: 'select_pid',
		message: 'Select the bot you want to stop?'
	}
];
