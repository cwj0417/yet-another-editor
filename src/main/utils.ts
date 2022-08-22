import { app } from 'electron'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { watch, ref, toRaw } from 'vue'

const userPath = app.getPath('userData')

const keyMapToAccelerator = {
    altKey: 'Alt',
    ctrlKey: 'Ctrl',
    metaKey: 'Meta',
    shiftKey: 'Shift'
}
const keyToAccelerator = (key: string) => {
    return Object.keys(keyMapToAccelerator).indexOf(key) > -1 ? keyMapToAccelerator[key as keyof typeof keyMapToAccelerator] : key.toUpperCase()
}

const getUserConf = (name: string) => {
    const confPath = join(userPath, `${name}.json`)
    return existsSync(confPath) ? JSON.parse(readFileSync(confPath, { encoding: 'utf-8' }).toString()) as any : {}
}

const useUserData = (name = 'main', init = {}, extraEffect: any = null) => {
    let userData = ref<any>(init)
    const confPath = join(userPath, `${name}.json`)
    if (existsSync(confPath)) {
        userData.value = JSON.parse(readFileSync(confPath, { encoding: 'utf-8' }))
        console.log('got userdata', name, toRaw(userData.value))
        extraEffect?.(toRaw(userData.value))
    } else {
        writeFileSync(confPath, JSON.stringify(init))
    }
    watch(userData.value, val => {
        console.log('set userdata', name, toRaw(val))
        writeFileSync(confPath, JSON.stringify(val))
        extraEffect?.(toRaw(val))
    })

    return userData
}

export {
    keyToAccelerator,
    userPath,
    getUserConf,
    useUserData,
}
