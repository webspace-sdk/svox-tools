import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import { Buffers as SVOXBuffers, ModelReader, SvoxMeshGenerator, SvoxToThreeMeshConverter } from 'smoothvoxels'
import * as fs from 'fs'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import * as THREE from 'three'
import { Blob } from 'buffer'
import FileReader from 'filereader'

global.THREE = THREE
global.FileReader = FileReader
global.Blob = Blob
global.window = { FileReader }

const argv = yargs(hideBin(process.argv))
  .command('$0 <input> [output]', 'Convert SVOX file to GLTF file', (argv) => {
    argv
      .option('binary', { alias: 'b', description: 'Save binary (.glb) GLTF file', type: 'boolean', default: false })
      .positional('input', { describe: 'Input MagicaVoxel format VOX file', type: 'string' })
      .positional('output', { describe: 'Output SVOX file (default stdout)', type: 'string', default: '-' })
  }).help().argv

const svoxData = fs.readFileSync(argv.input)
const model = ModelReader.readFromString(svoxData.toString())
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
  gltf = argv.binary ? gltf : JSON.stringify(gltf)

  if (argv.output === '-') {
    process.stdout.write(gltf)
  } else {
    fs.writeFileSync(argv.output, gltf)
  }
}, exportoptions)
