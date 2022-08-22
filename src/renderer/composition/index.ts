import { watch, ref, toRaw, onMounted, onUnmounted } from 'vue'

import { notification } from "../../type";

const { fs, join, ipcRenderer } = window.apis as any

const useUserData = (name = 'main', init = {}, extraEffect: any = null) => {
    let userData = ref<any>(init)
    ipcRenderer.invoke('getUserPath')
        .then((userpath: string) => {
            const confPath = join(userpath, `${name}.json`)
            if (fs.existsSync(confPath)) {
                userData.value = JSON.parse(fs.readFileSync(confPath, { encoding: 'utf-8' }))
                console.log('got userdata', name, toRaw(userData.value))
            } else {
                fs.writeFileSync(confPath, JSON.stringify(init))
            }
            watch(userData, val => {
                console.log('set userdata', name, toRaw(val))
                fs.writeFileSync(confPath, JSON.stringify(val))
                extraEffect?.(toRaw(val))
            }, { deep: true })
        })

    return userData
}

const useTimer = () => {
    let timers: any = ref([]);
    let timerHandler: NodeJS.Timeout | null = null;
    const fetchTimers = () => {
        if (timerHandler) clearInterval(timerHandler)
        ipcRenderer
        .invoke("getNotificationQ")
        .then((messageQ: notification[]) => {
            const render = () => {
                timers.value = messageQ
                    .map((item) => ({
                        id: item.id,
                        content: item.content,
                        last: Math.round((item.end - item.createTime) / 1000),
                        percent: (item.end - Date.now()) / (item.end - item.createTime),
                        remain: Math.round((item.end - Date.now()) / 1000),
                    }))
                    .filter((i) => i.remain > 0);
            };
            timerHandler = setInterval(render, 1000);
            render();
        });
    }
    onMounted(() => {
        fetchTimers()
    })
    onUnmounted(() => {
        clearInterval(timerHandler!);
    });
    return {
        timers,
        fetchTimers,
    }
}

export {
    useUserData,
    useTimer,
}
