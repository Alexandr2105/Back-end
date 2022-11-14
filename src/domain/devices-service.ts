import {refreshTokenRepository} from "../repositories/refresh-token-repository";
import {securityDevicesRepository} from "../repositories/security-devices-repository";

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
    },
    async delAllDevicesExcludeCurrent(deviceId: string) {
        await securityDevicesRepository.delAllDevicesExcludeCurrent(deviceId);
    },
    async delDevice(deviceId: string): Promise<boolean> {
        return await securityDevicesRepository.delDevice(deviceId);
    }
}