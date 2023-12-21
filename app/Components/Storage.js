import AsyncStorage from '@react-native-async-storage/async-storage';



export async function setData(key, data) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error(`useAsyncStorage setItem ${key} error:`, error)
    }
}

export async function getData(key) {
    try {
        let data = await AsyncStorage.getItem(key)
        return JSON.parse(data)
    } catch (error) {
        console.error(`useAsyncStorage getItem ${key} error:`, error)
    }
}

export async function removeData(key) {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.error(`useAsyncStorage removeItem ${key} error:`, error)
    }
}
