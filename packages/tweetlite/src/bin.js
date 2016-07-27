import parseArgs from 'minimist'
import tweetliteCli from 'tweetlite-cli'
import omit from 'object.omit'

const args = parseArgs(process.argv)
const cmd = args._
const extra = omit(args, ['_'])
const version = require('../package.json').version

tweetliteCli(cmd[2], extra, version)
