import parseArgs from 'minimist'
import twitbotCli from 'twitbot-cli'
import omit from 'object.omit'

const args = parseArgs(process.argv)
const cmd = args._
const extra = omit(args, ['_'])
const version = require('../package.json').version

twitbotCli(cmd[2], extra, version)
