const { createServer, build } = require('vite')
const { join } = require('path')
const { readdirSync } = require('fs')
const detect = require('detect-port')

const entries = readdirSync(join(__dirname, '../src/renderer')).filter(f => f.endsWith('.html'))
    .map(f => join(__dirname, '../src/renderer', f))

const configFile = join(__dirname, '..', 'vite.config.js')

const rendererDevServer = async () => {
    const port = await detect(3000)
    const server = await createServer({
        ...configFile,
        server: {
            port,
        }
    })
    await server.listen()
    return {
        port,
    }
}

const rendererBuild = async () => {
    await build({
        ...configFile,
        base: '',
        build: {
            rollupOptions: {
                input: entries,
            },
            outDir: join(__dirname, '..', 'dist', 'renderer'),
        },
        mode: 'production',
    })
}

module.exports = {
    rendererDevServer,
    rendererBuild,
}
