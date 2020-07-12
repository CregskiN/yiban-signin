import schedule from 'node-schedule';

export default class Schedule {

    /**
     * 设置定时任务
     */
    static scheduleCronstyle(timeOperate: string, callback: Function) {
        return schedule.scheduleJob(timeOperate, function () {
            callback();
        });
    }
}
