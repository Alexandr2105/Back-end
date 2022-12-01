import {securityDevicesRepository} from "../repositories/security-devices-repository";
import {RefreshTokenDataTypeForDB} from "../helper/allTypes";

class DevicesService {
    createDeviceId() {
        return +new Date() + "";
    };

    async saveInfoAboutDevicesUser(iat: number, exp: number, deviceId: string, userId: string, userIp: string, deviceName: string | undefined) {
        const infoAboutRefreshToken = new RefreshTokenDataTypeForDB(iat, exp, deviceId, userIp, deviceName, userId);
        await securityDevicesRepository.saveInfoAboutRefreshToken(infoAboutRefreshToken);
    };

    async delOldRefreshTokenData(date: number) {
        await securityDevicesRepository.delOldRefreshTokenData(date);
    };

    async delAllDevicesExcludeCurrent(deviceId: string) {
        await securityDevicesRepository.delAllDevicesExcludeCurrent(deviceId);
    };

    async delDevice(deviceId: string): Promise<boolean> {
        return await securityDevicesRepository.delDevice(deviceId);
    };

    async updateInfoAboutDeviceUser(iat: number, exp: number, deviceId: string, ip: string, deviceName: string | undefined, userId: string) {
        await securityDevicesRepository.updateInfoAboutDeviceUser(iat, exp, deviceId, ip, deviceName, userId);
    };
}

export const devicesService = new DevicesService();