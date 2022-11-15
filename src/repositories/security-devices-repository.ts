import {RefreshTokenData, refreshTokenDataCollection} from "../db/db";

export const securityDevicesRepository = {
    async saveInfoAboutRefreshToken(infoRefreshToken: RefreshTokenData) {
        await refreshTokenDataCollection.insertOne(infoRefreshToken);
    },
    async delAllDevicesExcludeCurrent(deviceId: string) {
        await refreshTokenDataCollection.deleteMany({deviceId: {$ne: deviceId}});
    },
    async delDevice(deviceId: string): Promise<boolean> {
        const result = await refreshTokenDataCollection.deleteOne({deviceId: deviceId});
        return result.deletedCount === 1;
    },
    async getAllDevicesUser(userId: string) {
        const deviceInfo = await refreshTokenDataCollection.find({userId: userId}).toArray();
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
        const a = await refreshTokenDataCollection.deleteMany({exp: {$lt: timeInSeconds}});
        console.log(a.deletedCount);
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