import db from "../database/connection";
import Task from "../models/Task";

class TaskRepository {

    public static insertTask(task_name: string, desc_task: string, event_code: number, access_code: number): Promise<Task> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedTask =
                await trx('tb_task')
                    .insert({
                        nm_task: task_name,
                        ds_task: desc_task,
                        cd_event: event_code,
                        cd_access_user: access_code
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findTaskById(idTask: number): Promise<Array<Task>> {

        return new Promise(async (resolve) => {
            const task =
            await db('tb_task as t')
                .select('*')
                .where('t.cd_task', '=', idTask);

            resolve(task);
        });
    }

    public static async findTaskByEventId(idEvent: number): Promise<Array<Task>> {

        return new Promise(async (resolve) => {
            const task =
            await db('tb_task as t')
                .select('*')
                .where('t.cd_event', '=', idEvent);

            resolve(task);
        });
    }

    public static async deleteTaskById(idTask: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            await trx('tb_task')
                .where('cd_task', '=', idTask)
                .delete();

            trx.commit()
                .then(() => { resolve(); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }
}

export default TaskRepository;