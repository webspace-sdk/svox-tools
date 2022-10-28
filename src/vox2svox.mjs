import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import { ModelWriter, voxToSvox } from 'smoothvoxels'
import * as fs from 'fs'

const argv = yargs(hideBin(process.argv))
  .command('$0 <input> [output]', 'Convert MagicaVoxel format VOX file to SVOX file', (argv) => {
    argv
      .option('mod', { alias: 'm', description: 'Additional model settings (eg \'shape cylinder-y, ao = 2 1\')', type: 'string' })
      .option('mat', { alias: 'k', description: 'Additional material settings (eg \'lighting = smooth, deform = 3, fade = true\')', type: 'string' })
      .option('compression', { alias: 'c', description: 'Compression settings (auto|on|off)', type: 'string', default: 'auto' })
      .positional('input', { describe: 'Input MagicaVoxel format VOX file', type: 'string' })
      .positional('output', { describe: 'Output SVOX file (default stdout)', type: 'string', default: '-' })
  }).help().argv

const voxData = fs.readFileSync(argv.input)
const model = voxToSvox(voxData)
const compressed = argv.compression === 'on' || (argv.compression === 'auto' && Math.max(model.size.x, model.size.y, model.size.z) >= 32)

const modelSize = model.size.x === model.size.y && model.size.x === model.size.z ? `${model.size.x}` : `${model.size.x} ${model.size.y} ${model.size.z}`
// get scale
const modelScale = argv.mod && argv.mod.indexOf('scale =') >= 0 ? '' : ', scale = ' + (model.scale.x === model.scale.y && model.scale.x === model.scale.z ? `${model.scale.x}` : `${model.scale.x} ${model.scale.y} ${model.scale.z}`)
const modelOrigin = argv.mod && argv.mod.indexOf('origin =') >= 0 ? '' : `, origin = ${model.origin}`

const modelLine = `size = ${modelSize}${modelScale}${modelOrigin}${argv.mod ? ', ' + argv.mod : ''}`

const out = ModelWriter.writeToString(model, compressed, false, modelLine, argv.mat || null)

if (argv.output === '-') {
  process.stdout.write(out)
} else {
  fs.writeFileSync(argv.output, out)
}
