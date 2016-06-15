import parseArgs from 'minimist'
import twitbotCli from 'twitbot-cli'
const args = parseArgs(process.argv)
const cmd = args._
const version = require('../package.json').version

twitbotCli.start(cmd[2], args, version)
