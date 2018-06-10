import { help } from '../src/index'

describe('tweetlite-util Test', () => {

	test('Help function Test', async () => {
		expect(typeof help()).toBe('string')
	});

});