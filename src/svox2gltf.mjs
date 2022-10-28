import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import { Buffers as SVOXBuffers, ModelReader, SvoxMeshGenerator, SvoxToThreeMeshConverter } from 'smoothvoxels'
import * as fs from 'fs'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

const argv = yargs(hideBin(process.argv))
  .command('$0 <input> [output]', 'Convert SVOX file to GLTF file', (argv) => {
    argv
      .option('binary', { alias: 'b', description: 'Save binary (.glb) GLTF file', type: 'string', default: false })
  }).help().argv

const svoxData = fs.readFileSync(argv.input)
const model = ModelReader.readFromString(svoxData)
const buffers = new SVOXBuffers(1024 * 768 * 2)
const svoxmesh = SvoxMeshGenerator.generate(model, buffers)
const mesh = SvoxToThreeMeshConverter.generate(svoxmesh)
const exporter = new GLTFExporter()
const exportoptions = {
  binary: !!argv.binary,
  onlyVisible: true,
  trs: true,
  embedImages: true,
  forcePowerOfTwoTextures: false,
  truncateDrawRange: false,
  forceIndices: true
}

exporter.parse(mesh, function (gltf) {
  if (argv.output === '-') {
    process.stdout.write(gltf)
  } else {
    fs.writeFileSync(argv.output, gltf)
  }
}, exportoptions)
