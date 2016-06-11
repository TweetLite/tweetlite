import parseArgs from 'minimist';
import _ from 'lodash';
import clor from 'clor';
import TT from './twit';
import * as util from './util';
import forever from 'forever';
import loudRejection from 'loud-rejection';
import path from 'path';
const args = parseArgs(process.argv);
const cmd = args._;
loudRejection();


switch (cmd[2]) {
	case 'profile' :
		(async()=>{
			try{
				const answers = await util.prompt('config');
				const result = await util.nconfSave(`users:${answers.username}`,answers);
				console.log(`  ${clor.green(result)}`);
			} catch(err){
				console.log(err);
			}
		})();
		break;
	case 'search':
		(async()=>{
			if (util.checkUser()) {
				try{
				let answers = await util.prompt('search');
				const confd = util.getUser(answers.select_account);
				const T = new TT(confd);
				const twetList = await T.searchFollow({q:keyword,takip_sayi:takip_sayi, lang:confd.lang});

				if(answers.favorite === 'Yes'){
					const favoriteList = await T.fullTwetFavorite(twetList.map(item => item.id));
				}

				if(answers.takip === 'Yes'){
					const userList = await T.FullUserFollow(twetList.map(item => item.user.id));
				}

				console.log(`  ${clor.green('Transactions completed.')}`);
				if (answers.takip === 'Yes') {
				   console.log(`  ${clor.yellow(`${userList.length}  people were followed.`)}`);
				}
				if (answers.favorite === 'Yes') {
					console.log(`  ${clor.yellow(`${favoriteList.length}  tweets favorite added.`)}`);
				}

				} catch(err){
					console.log(err);
				}
			} else {
				console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
			}
		})();
		break;
	case 'unfavorite' :
		(async()=>{
			if (util.checkUser()) {
				try{

					let {select_account} = await util.prompt('accountlist');
					const confd = util.getUser(select_account);
					const T = new TT(confd);
					const msg = util.spinnerMsg(`Twitbot working.. `);
					const favoriteList = await T.fullFavoriteList();
					const favoriteDestory = await T.fullDestoryFavorite(favoriteList.map(item => item.id_str));
					clearInterval(msg);
					console.log(`  ${clor.green('All favorites removed')}`);

					} catch(err){
						console.log(err);
					}
			} else {
				console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
			}
		})();
		break;
	case 'flush' :
		(async()=>{
			if (util.checkUser()) {
				const users = util.getUsers();
				try{

				let {select_account} = await util.prompt('accountlist');
				delete users[select_account];
				const msg = await util.nconfSave(`users`, users);
				console.log(msg);


				} catch(err){
					console.log(err);
				}
			} else {
				console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
			}
		})();
		break;
	case 'message':
		(async()=>{
			if (util.checkUser()) {
				try{
					let {select_account} = await util.prompt('messagelist');
					const confd = util.getUser(select_account);
					const T = new TT(confd);
					if(answers.send === 'Yes' && answers.message) {
						const followersList = await T.fullFollowerList();
						if(answers.limit){
							const list = followersList.ids.slice(0, answers.limit);
						}
						const msgCount = await T.fullUserMessage(list,answers.message).length;
						console.log(`  ${clor.green(`Persons posted ${MessageCount} messages `)}`);
					}else{
						console.log(`${clor.red('Come back when he decided to take a message..')}`);
					}
				} catch(err){
					console.log(err);
				}
			} else {
				console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
			}
		})();
		break;
	case 'unfollow' :
		(async()=>{
			if (util.checkUser()) {
				try{
				let {select_account} = await util.prompt('unfollowlist');
				const confd = util.getUser(select_account);
				const T = new TT(confd);

					if(answers.send === 'Yes') {
						const fullListids = await T.fullFollowerList();
						const result = await T.fullUserDestroy(fullListids);
						console.log(`${clor.red('${result.length} users unfollowed..')}`);
					}

				} catch(err){
					console.log(err);
				}
			} else {
				console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
			}
		})();
		break;
	case 'version':
		console.log(require('../package.json').version);
		break;
	case 'help':
		util.help();
		break;
	default:
		util.help();
}
