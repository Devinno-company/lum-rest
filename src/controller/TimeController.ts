import insertTime from "../interfaces/inputRepository/insertTime";
import UpdateTime from "../interfaces/request/UpdateTimeRequest";
import TimeResponse from "../interfaces/response/TimeResponse";
import User from "../models/User";
import EventRepository from "../repositorys/EventRepository";
import TimeRepository from "../repositorys/TimeRepository";
import havePermission from "../utils/havePermission";

class TimeController {

    async insertTime(user: User, idEvent: number, time: insertTime): Promise<TimeResponse> {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (JSON.stringify(time) === '{}') {
                reject({ status: 400, message: 'No field to insert' });
            }
            else if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'COO')
                        .then(() => {                              
                              TimeRepository.insertTime(time, event.cd_event)
                              .then(async (newTime) => {
                                    const date = new Date(newTime.dt_time);

                                    newTime.dt_time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                                                  
                                    newTime.hr_start = newTime.hr_start.slice(0, 5);
                                    newTime.hr_end = newTime.hr_end.slice(0, 5);

                                    resolve({
                                            cd_time: newTime.cd_time,
                                            nm_time: newTime.nm_time,
                                            ds_time: newTime.ds_time,
                                            dt_time: newTime.dt_time,
                                            hr_start: newTime.hr_start,
                                            hr_end: newTime.hr_end
                                    })
                                })
                                  .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                        })
                        .catch(() => reject({ status: 401, message: 'You are not allowed do so' }));
            }
        });
    }

    async readTime(user: User, idEvent: number, idTime: number): Promise<TimeResponse> {
        
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);
            const time = await TimeRepository.findTimeById(idTime);
            
            if (!event)
            reject({ status: 404, message: 'This event does not exist' });
            if (!time)
            reject({ status: 404, message: 'This time does not exist' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(() => {
                            const date = new Date(time.dt_time);

                            time.dt_time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

                            time.hr_start = time.hr_start.slice(0, 5);
                            time.hr_end = time.hr_end.slice(0, 5);

                        resolve({
                            cd_time: time.cd_time,
                            nm_time: time.nm_time,
                            ds_time: time.ds_time,
                            dt_time: time.dt_time,
                            hr_start: time.hr_start,
                            hr_end: time.hr_end 
                        });
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            }
        });
    }

    async readTimes(user: User, idEvent: number): Promise<Array<TimeResponse>> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);
            const times = await TimeRepository.findTimeByEventId(idEvent);
            const timesResponse: Array<TimeResponse> = [];

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            if (!times)
                reject({ status: 404, message: 'There are no times' });
            else {
                await havePermission(user.cd_user, event.cd_event, 'EQP')
                    .then(() => {
                        for (let i = 0; i < times.length; i++) {

                            timesResponse.push({
                                cd_time: times[i].cd_time,
                                nm_time: times[i].nm_time,
                                ds_time: times[i].ds_time,
                                dt_time: times[i].dt_time,
                                hr_start: times[i].hr_start,
                                hr_end: times[i].hr_end 
                            });
                        }       
                        resolve(timesResponse);
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            };
        });
    }

    async updateTime(user: User, updateTime: UpdateTime, idEvent: number, idTime: number): Promise<TimeResponse> {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);
            const time = await TimeRepository.findTimeById(idTime);
            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            if (!time)
                reject({ status: 404, message: 'This time does not exist' });

            if (JSON.stringify(updateTime) === '{}') {
                reject({ status: 400, message: 'No field to update' });
            } else {
                await havePermission(user.cd_user, event.cd_event, 'COO')
                    .then(() => {
                        TimeRepository.updateTime(idTime, updateTime)
                            .then(async () => {
                                const NewTime = await this.readTime(user, event.cd_event, time.cd_time)
                                resolve(NewTime)
                            })
                            .catch(err => reject(err));
                    })
                    .catch(() => reject({ status: 401, message: 'You are not allowed to do so' }));
            }
        });
    }

    deleteTime(user: User, idEvent: number, idTime: number) {
        return new Promise(async (resolve, reject) => {
            const time = await TimeRepository.findTimeById(idTime);
            const event = await EventRepository.findEventById(idEvent);

            if (!time)
                reject({ status: 404, message: "This time doesn't exist" })
            else {
                if (!await havePermission(user.cd_user, event.cd_event, 'COO'))
                    reject({ status: 401, message: "You are not allowed do so" });
                else {
                        TimeRepository.deleteTimeById(idTime)
                            .then(() => { resolve() })
                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); })
                }
            }
        });
    }
}

export default TimeController;