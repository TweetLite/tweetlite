import test from 'ava'
import * as util from '../src/index'
import fakeTwet from './fake.json'

test('Help output check',t => {
		t.plan(10)
    t.is(typeof util.help(), 'string')
		t.true(util.help().includes(`profile`))
		t.true(util.help().includes(`help`))
		t.true(util.help().includes(`search`))
		t.true(util.help().includes(`message`))
		t.true(util.help().includes(`version`))
		t.true(util.help().includes(`unfollow`))
		t.true(util.help().includes(`unfavorite`))
		t.true(util.help().includes(`flush`))
		t.true(util.help().includes(`watch`))
})

test('Question check', t => {
	t.is(typeof util.question, 'object')
	t.deepEqual(util.question.config[5].choices, ['en', 'tr'])
	t.notDeepEqual(util.question.search[2].choices, ['No', 'Nooo'])
	t.is(util.question.search[2].choices.length, 2)
	t.is(Object.keys(util.question).length, 7)
  t.not(Object.keys(util.question).length, 4)
	t.is(util.question.config[0].validate(), 'Do not leave empty')
	t.true(util.question.config[0].validate(`Check this`), 'Question validate check')
})

test.todo(`After: Prompt check test`)


test(`User control`, t => {
	t.is(typeof util.checkUser, `function`)
	t.is(typeof util.getUser, `function`)
	t.is(typeof util.getUsers, `function`)
	t.not(typeof util.getUsers, `object`)
	t.is(typeof util.settingsSave,  `function`)
})


test(`Blacklist, User control`, t => {
	const checkUser = util.notActionHimself('foo')
	const checkBlock = util.notActionBlocks(["4333112439","4333112432","43331124356"])
	t.is(typeof checkUser, `function`)
	t.true(checkUser(fakeTwet))
	t.false(checkBlock(fakeTwet))
	t.true(checkBlock({user:{id_str:'ffff'}}))
	t.pass(util.control(fakeTwet, [util.notActionHimself('bar'), util.notActionBlocks(['fff','cccc'])]))
	t.throws(util.control(fakeTwet, [util.notActionHimself('HappiestWelcome'), util.notActionBlocks(['4333112439'])]))
})

test.todo(`After: actions test`)
test.todo(`After: config check test`)
