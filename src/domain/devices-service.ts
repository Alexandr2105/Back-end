import {SecurityDevicesRepository} from "../repositories/security-devices-repository";
import {RefreshTokenDataTypeForDB} from "../helper/allTypes";

export class DevicesService {
    private securityDevicesRepository: SecurityDevicesRepository;

    constructor() {
        this.securityDevicesRepository = new SecurityDevicesRepository();
    };

    createDeviceId() {
        return +new Date() + "";
    };

    async saveInfoAboutDevicesUser(iat: number, exp: number, deviceId: string, userId: string, userIp: string, deviceName: string | undefined) {
        const infoAboutRefreshToken = new RefreshTokenDataTypeForDB(iat, exp, deviceId, userIp, deviceName, userId);
        await this.securityDevicesRepository.saveInfoAboutRefreshToken(infoAboutRefreshToken);
    };

    async delOldRefreshTokenData(date: number) {
        await this.securityDevicesRepository.delOldRefreshTokenData(date);
    };

    async delAllDevicesExcludeCurrent(deviceId: string) {
        await this.securityDevicesRepository.delAllDevicesExcludeCurrent(deviceId);
    };

    async delDevice(deviceId: string): Promise<boolean> {
        return await this.securityDevicesRepository.delDevice(deviceId);
    };

    async updateInfoAboutDeviceUser(iat: number, exp: number, deviceId: string, ip: string, deviceName: string | undefined, userId: string) {
        await this.securityDevicesRepository.updateInfoAboutDeviceUser(iat, exp, deviceId, ip, deviceName, userId);
    };
}