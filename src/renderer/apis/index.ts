const fs: any = apis.fs as any

let type: null | Symbol = null

const getDir = (dir: string) => fs.readdirSync(dir, { withFileTypes: true })
    ?.filter((i: { name: string }) => !i.name.startsWith('.') ?? [])
    .map((each: any) => {
        if (!type) {
            type = Object.getOwnPropertySymbols(each)[0]
        }
        return {
            name: each.name,
            type: each[type!]
        }
    })

const readFile = (dir: string) => fs.readFileSync(dir, {encoding: 'utf-8'}).toString()


export {
    getDir,
    readFile,
}
