var twitbot = require('./dist/index.js');



TT.use({
    lists:{
        path: 'lists/list',
        method: 'get'
    },
		listsUsers: {
			path:'lists/subscribers',
			method: 'get'
		}
})



TT.extra.fullFavorites().then(result =>{
  console.log(result)
}).catch(err => {
  console.log('bum')
  console.log(err)
})