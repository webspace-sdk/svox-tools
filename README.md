# svox-tools
Command line tools for converting to/from [Smooth Voxels](https://github.com/jel-app/smoothvoxels) files.

You can [download binaries](https://github.com/jel-app/svox-tools/releases) from releases.

Included in this repo are two tools:

- `vox2svox` - Convert a MagicaVoxel VOX file to an SVOX file
- `svox2gltf` - Convert a SVOX file to a GLTF

Usage:

```
vox2svox <input> [output]

Convert MagicaVoxel format VOX file to SVOX file

Positionals:
  input   Input MagicaVoxel format VOX file                                                                     [string]
  output  Output SVOX file                                                                       [string] [default: "-"]

Options:
      --version      Show version number                                                                       [boolean]
      --help         Show help                                                                                 [boolean]
  -m, --mod          Additional model settings (eg 'shape cylinder-y, ao = 2 1')                                [string]
  -k, --mat          Additional material settings (eg 'lighting = smooth, deform = 3, fade = true')             [string]
  -c, --compression  Compression settings                      [string] [choices: "auto", "on", "off"] [default: "auto"]
  
```

```
svox2gltf <input> [output]

Convert SVOX file to GLTF file

Positionals:
  input   Input MagicaVoxel format VOX file                             [string]
  output  Output SVOX file (default stdout)              [string] [default: "-"]

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -b, --binary   Save binary (.glb) GLTF file         [boolean] [default: false]
```
