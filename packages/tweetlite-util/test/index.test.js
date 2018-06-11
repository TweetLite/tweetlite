import { help, question, checkUser, getUser, getUsers, settingsSave } from '../src/index'
import fakejson from './fake.json'

describe('tweetlite-util Test', () => {

	test('Help function Test', async () => {
		expect(typeof help()).toBe('string')
		expect(help()).toEqual(expect.stringContaining('profile'))
		expect(help()).toEqual(expect.stringContaining('search'))
		expect(help()).toEqual(expect.stringContaining('watch'))
	});

	test('Question check', async () => {
		expect(typeof question).toBe('object')
		expect(question).toEqual(expect.objectContaining({
			config: expect.anything(),
			search: expect.anything(),
			watch: expect.anything(),
			accountlist: expect.anything(),
			unfollowlist: expect.anything(),
			process: expect.anything(),
			messagelist: expect.anything(),
		  }))
		expect(question.search[2].choices.length).toEqual(2)
		expect(question.config[5].choices).toEqual(['en', 'tr'])
		expect(question.search[2].choices).not.toEqual(expect.arrayContaining(['x', 'y']))
		expect(question.config[0].validate()).toEqual('Do not leave empty')
		expect(question.config[0].validate(`Check this`)).toEqual(true)
	})
	  
	test('After: Prompt check test')

	test(`User functions Test`, async () => {
    	expect(typeof checkUser).toEqual(`function`)
    	expect(typeof getUser).toEqual(`function`)
    	expect(typeof getUsers).toEqual(`function`)
		expect(typeof getUsers).not.toEqual(`object`)
    	expect(typeof settingsSave).toEqual(`function`)
    })

	test(`After: actions test`)
	test(`After: config check test`)
	test(`Blacklist, User control`)
});