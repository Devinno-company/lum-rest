import db from "../database/connection";
import newTaskRequest from "../interfaces/request/newTaskRequest";
import UpdateTaskRequest from "../interfaces/request/UpdateTaskRequest";
import Task from "../models/Task";

class TaskRepository {

    public static insertTask(newTask: newTaskRequest, event_id: number): Promise<Task> {
        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const insertedTask =
                await trx('tb_task')
                    .insert({
                        nm_task: newTask.name,
                        ds_task: newTask.description,
                        cd_event: event_id,
                    }).returning('*');

            await trx.commit()
                .then(() => { resolve(insertedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async findTaskById(idTask: number): Promise<Task> {

        return new Promise(async (resolve) => {
            const task =
                await db('tb_task as t')
                    .select('*')
                    .where('t.cd_task', '=', idTask);

            resolve(task[0]);
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

    public static async findTaskByAccessId(idAccess: number): Promise<Array<Task>> {

        return new Promise(async (resolve) => {
            const task =
                await db('tb_task as t')
                    .select('*')
                    .where('t.cd_access_user', '=', idAccess);

            resolve(task);
        });
    }

    public static async updateTaskById(idTask: number, updateTask: UpdateTaskRequest): Promise<Task> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTask =
                await trx('tb_task')
                    .update({
                        nm_task: updateTask.name_to,
                        ds_task: updateTask.description_to
                    })
                    .where('cd_task', '=', idTask)
                    .returning('*');

            trx.commit()
                .then(() => { resolve(updatedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async removeUserFromTask(idTask: number): Promise<Task> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTask =
                await trx('tb_task')
                    .update({
                        cd_access_user: null
                    })
                    .where('cd_task', '=', idTask)
                    .returning('*');

            trx.commit()
                .then(() => { resolve(updatedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async assignTaskByAccessId(idTask: number, access_id: number): Promise<Task> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTask =
                await trx('tb_task')
                    .update({
                        cd_access_user: access_id
                    })
                    .where('cd_task', '=', idTask)
                    .returning('*');

            trx.commit()
                .then(() => { resolve(updatedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async completeTaskById(idTask: number): Promise<Task> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTask =
                await trx('tb_task')
                    .update({
                        id_completed: true
                    })
                    .where('cd_task', '=', idTask)
                    .returning('*');

            trx.commit()
                .then(() => { resolve(updatedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async uncompleteTaskById(idTask: number): Promise<Task> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const updatedTask =
                await trx('tb_task')
                    .update({
                        id_completed: false
                    })
                    .where('cd_task', '=', idTask)
                    .returning('*');

            trx.commit()
                .then(() => { resolve(updatedTask[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async cleanAccessByAccessId(idAccess: number): Promise<Array<Task>> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const tasks =
                await trx('tb_task as t')
                    .update({
                        cd_access_user: null
                    })
                    .where('cd_access_user', '=', idAccess)
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(tasks); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
        });
    }

    public static async cleanAccessById(idTask: number): Promise<Task> {

        return new Promise(async (resolve, reject) => {
            const trx = await db.transaction();

            const tasks =
                await trx('tb_task')
                    .update({
                        cd_access_user: null
                    })
                    .where('cd_task', '=', idTask)
                    .returning('*');

            await trx.commit()
                .then(() => { resolve(tasks[0]); })
                .catch((err) => {
                    trx.rollback();
                    reject(err);
                });
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