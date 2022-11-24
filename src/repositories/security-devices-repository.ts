import {refreshTokenDataCollection} from "../db/db";
import {RefreshTokenDataTypeForDB} from "../helper/allTypes";

export const securityDevicesRepository = {
    async saveInfoAboutRefreshToken(infoRefreshToken: RefreshTokenDataTypeForDB) {
        await refreshTokenDataCollection.create(infoRefreshToken);
    },
    async delAllDevicesExcludeCurrent(deviceId: string) {
        await refreshTokenDataCollection.deleteMany({deviceId: {$ne: deviceId}});
    },
    async delDevice(deviceId: string): Promise<boolean> {
        const result = await refreshTokenDataCollection.deleteOne({deviceId: deviceId});
        return result.deletedCount === 1;
    },
    async getAllDevicesUser(userId: string) {
        const deviceInfo = await refreshTokenDataCollection.find({userId: userId});
        return deviceInfo.map(a => {
            return {
                ip: a.ip,
                title: a.deviceName,
                lastActiveDate: new Date(a.iat).toISOString(),
                deviceId: a.deviceId
            }
        });
    },
    async delOldRefreshTokenData(date: number) {
        const timeInSeconds = Math.round(date / 1000);
        await refreshTokenDataCollection.deleteMany({exp: {$lt: timeInSeconds}});
    },
    async updateInfoAboutDeviceUser(iat: number, exp: number, deviceId: string, ip: string, deviceName: string | undefined, userId: string) {
        await refreshTokenDataCollection.updateOne({$and: [{userId: userId}, {deviceId: deviceId}]}, {
            $set: {
                iat: iat,
                exp: exp,
                ip: ip,
                deviceName: deviceName
            }
        })
    }
};