exports.config = [
{
	type: 'input',
	name: 'username',
	message: 'Kullanıcı Adı ?',
	validate: function( value ) {
		var that = null;
		if (value !== '' && value) {
			that = true;
		} else {
			that = 'Boş bırakmayın';
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
			that = 'Boş bırakmayın';
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
			return 'Boş bırakmayın';
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
			return 'Boş bırakmayın';
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
			that = 'Boş bırakmayın';
		}
		return that;
	}
},
{
	type: 'input',
	name: 'lang',
	message: 'Belli bir dil ?',
	default: ['tr','en'],
	validate: function (value) {
		var that = null;
		if (value !== '' && value && value.length >= 2) {
			that = true;
		} else {
			that = 'Doğru yazdığınızdan emin olun';
		}
		return that;
	}
}
];

exports.start = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Hesabınızı seçin?'
	},
	{
		type: 'input',
		name: 'takip_sayi',
		message: 'Takip sayısı ?',
		validate: function (value) {
			var that = null;
			if (value !== '' && value) {
				if (value <= 150) {
					that = true;
				} else {
					that = 'Takip sayısı 100 geçmemeli';
				}
			} else {
				that = 'Boş bırakmayın';
			}
			return that;
		}
	},
	{
    type: "list",
    name: "favorite",
    message: "Favorilere eklensin mi?",
    choices: [ "Evet", "Hayır"]
  	},
  	{
    type: "list",
    name: "takip",
    message: "Takip edilsin mi?",
    choices: [ "Evet", "Hayır"]
  	},
  	{
		type: 'input',
		name: 'keyword',
		message: 'Aranacak Kelime ?',
		validate: function( value ) {
			var that = null;
			if (value !== '' && value) {
				that = true;
			} else {
				that = 'Boş bırakmayın';
			}
			return that;
		}
	}
];

exports.blacklist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Hesabınızı seçin?'
	},
	{
		type: 'input',
		name: 'blacklist_username',
		message: 'Kullanıcı Adını Girin ?',
		validate: function (value) {
			var that = null;
			if (value === '' && !value) {
				that = 'Boş bırakmayın';
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
		message: 'Hesabınızı seçin?'
	},
	{
		type: 'input',
		name: 'keywords',
		message: 'Kelimeleri girin ?',
		default:['Mr. Robot','Mr Robot'],
		validate: function (value) {
			var that = null;
			if (value === '' && !value) {
				that = 'Boş bırakmayın';
			} else {
				that = true;
			}
			return that;
		}
	},
	{
    type: "list",
    name: "favorite",
    message: "Favorilere eklensin mi?",
    choices: [ "Evet", "Hayır"]
  	},
  	{
    type: "list",
    name: "takip",
    message: "Takip edilsin mi?",
    choices: [ "Evet", "Hayır"]
  	}
];


exports.accountlist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Hesabınızı seçin ?'
	}
];



exports.messagelist = [
	{
		type: 'list',
		name: 'select_account',
		message: 'Hesabınızı seçin ?'
	},
	{
		type: 'input',
		name: 'message',
		message: 'İletini Yazın. :',
		validate: function (value) {
			var that = null;
			if (value === '' && !value) {
				if (value <= 140) {
					that = true;
				} else {
					that = 'Karakter sayısı 140 geçmemeli';
				}
			} else {
				that = true;
			}
			return that;
		}
	},
	{
   type: "list",
   name: "send",
   message: "Göndermek istediğine emin misin?",
   choices: [ "Evet", "Hayır"]
  }
];
