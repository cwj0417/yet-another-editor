const builder = require("electron-builder")
const Platform = builder.Platform
const { join } = require('path')
const { remove, writeFile } = require('fs-extra')
const { rendererBuild } = require('./renderer')
const { mainProdBuild } = require('./main')

const projRoot = join(__dirname, '..')

const runBuild = async () => {

    const isLocal = process.argv[2] === 'local'

    // 清理dist和built
    await remove(join(projRoot, 'build', 'built'))
    await remove(join(projRoot, 'dist', 'renderer'))
    await remove(join(projRoot, 'dist', 'main'))

    // vite(rollup)打包renderer进程
    await rendererBuild()

    // esbuild打包main进程
    await mainProdBuild()

    // 写入package.json
    const packageJson = require(join(projRoot, 'package.json'))
    writeFile(join(projRoot, 'dist', 'package.json'), JSON.stringify(packageJson))

    const config = require(join(projRoot, 'build', 'config.js'))

    if (isLocal) {
        config.mac.target = [{
            target: 'dir',
            arch: ['arm64']
        }]
    }

    // build electron
    builder.build({
        targets: Platform.MAC.createTarget(),
        config,
        publish: isLocal ? 'never' : 'always',
    })
        .then(() => {
            console.log('done')
        })
        .catch((error) => {
            console.log('err', error);
        })
}

runBuild()
