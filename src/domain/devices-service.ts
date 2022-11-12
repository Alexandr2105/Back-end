import {refreshTokenRepository} from "../repositories/refresh-token-repository";

export const devicesService = {
    createDeviceId() {
        return +new Date() + "";
    },
    async saveInfoAboutDevicesUser(iat: string, exp: string, deviceId: string, userId: string, userIp: string, deviceName: string | undefined) {
        const infoAboutRefreshToken = {
            iat: iat.toString(),
            exp: exp.toString(),
            deviceId: deviceId,
            ip: userIp,
            deviceName: deviceName,
            userId: userId
        };
        await refreshTokenRepository.saveInfoAboutRefreshToken(infoAboutRefreshToken);
    }
}