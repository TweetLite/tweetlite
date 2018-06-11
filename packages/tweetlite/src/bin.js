import parseArgs from 'minimist'
import tweetliteCli from 'tweetlite-cli'
import omit from 'object.omit'
import pkg from '../package.json'

const args = parseArgs(process.argv)
const cmd = args._
const extra = omit(args, ['_'])
const version = pkg.version

tweetliteCli(cmd[2], extra, version)
