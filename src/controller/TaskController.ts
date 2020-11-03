import newTaskRequest from "../interfaces/request/newTaskRequest";
import UpdateTaskRequest from "../interfaces/request/UpdateTaskRequest";
import TaskResponse from "../interfaces/response/TaskResponse";
import TeamMember from "../interfaces/response/TeamMember";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import RoleRepository from "../repositorys/RoleRepository";
import TaskRepository from "../repositorys/TaskRepository";
import UserRepository from "../repositorys/UserRepository";
import havePermission from "../utils/havePermission";

class TaskController {

    insertTask(user: User, idEvent: number, newTask: newTaskRequest): Promise<TaskResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'COO')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    TaskRepository.insertTask(newTask, idEvent)
                        .then(async (result) => {

                            let user_assigned: null | TeamMember = null;

                            if (result.cd_access_user) {
                                const access = await AccessRepository.findAccessById(result.cd_access_user);
                                const teamMember = await UserRepository.findUserById(access.cd_user);
                                const role = await RoleRepository.findRole(access.sg_role)

                                user_assigned = {
                                    id: teamMember.cd_user,
                                    name: teamMember.nm_user,
                                    surname: teamMember.nm_surname_user,
                                    image: teamMember.im_user,
                                    role: {
                                        name: role.nm_role,
                                        description: role.ds_role
                                    }
                                }
                            }

                            resolve({
                                id: result.cd_task,
                                name: result.nm_task,
                                completed: result.id_completed,
                                description: result.ds_task,
                                user_assigned
                            });
                        })
                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); });
                }
            }
        });
    }

    readTask(user: User, idEvent: number, idTask: number): Promise<TaskResponse> {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'EQP')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const task = await TaskRepository.findTaskById(idTask);

                    if (!task)
                        reject({ status: 404, message: "This task doesn't exists" });
                    else {
                        let user_assigned: null | TeamMember = null;

                        if (task.cd_access_user) {
                            const access = await AccessRepository.findAccessById(task.cd_access_user);
                            const teamMember = await UserRepository.findUserById(access.cd_user);
                            const role = await RoleRepository.findRole(access.sg_role)

                            user_assigned = {
                                id: teamMember.cd_user,
                                name: teamMember.nm_user,
                                surname: teamMember.nm_surname_user,
                                image: teamMember.im_user,
                                role: {
                                    name: role.nm_role,
                                    description: role.ds_role
                                }
                            }
                        }

                        resolve({
                            id: task.cd_task,
                            name: task.nm_task,
                            completed: task.id_completed,
                            description: task.ds_task,
                            user_assigned
                        });
                    }
                }
            }
        });
    }

    readTasks(user: User, idEvent: number): Promise<Array<TaskResponse>> {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'EQP')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const tasks = await TaskRepository.findTaskByEventId(idEvent);
                    const tasksResponse: Array<TaskResponse> = [];

                    for (let i = 0; i < tasks.length; i++) {

                        let user_assigned: null | TeamMember = null;

                        if (tasks[i].cd_access_user) {
                            const access = await AccessRepository.findAccessById(tasks[i].cd_access_user as number);
                            const teamMember = await UserRepository.findUserById(access.cd_user);
                            const role = await RoleRepository.findRole(access.sg_role)

                            user_assigned = {
                                id: teamMember.cd_user,
                                name: teamMember.nm_user,
                                surname: teamMember.nm_surname_user,
                                image: teamMember.im_user,
                                role: {
                                    name: role.nm_role,
                                    description: role.ds_role
                                }
                            }
                        }

                        tasksResponse.push({
                            id: tasks[i].cd_task,
                            name: tasks[i].nm_task,
                            completed: tasks[i].id_completed,
                            description: tasks[i].ds_task,
                            user_assigned
                        });
                    }

                    resolve(tasksResponse);
                }
            }
        });
    }

    updateTask(user: User, idEvent: number, idTask: number, updateTask: UpdateTaskRequest): Promise<TaskResponse> {

        return new Promise(async (resolve, reject) => {

            if (JSON.stringify(updateTask) === '{}')
                reject({ status: 400, message: 'No field to update' });
            else {
                const event = await EventRepository.findEventById(idEvent);

                if (!event)
                    reject({ status: 404, message: 'This event does not exist' });
                else {
                    const isAllowed = await havePermission(user.cd_user, idEvent, 'COO')
                        .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                    if (!isAllowed)
                        reject({ status: 401, message: "You are not allowed to do so" });
                    else {
                        const task = await TaskRepository.findTaskById(idTask);

                        if (!task)
                            reject({ status: 404, message: "This task doesn't exists" });
                        else {
                            if (task.id_completed)
                                reject({ status: 409, message: 'You cannot update an already completed task' })
                            else {
                                const updatedTask = await TaskRepository.updateTaskById(idTask, updateTask);

                                resolve({
                                    id: updatedTask.cd_task,
                                    name: updatedTask.nm_task,
                                    completed: updatedTask.id_completed,
                                    description: updatedTask.ds_task,
                                    user_assigned: null
                                });
                            }
                        }
                    }
                }
            }
        });
    }

    deleteTask(user: User, idEvent: number, idTask: number): Promise<void> {

        return new Promise(async (resolve, reject) => {

            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'COO')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const task = await TaskRepository.findTaskById(idTask);

                    if (!task)
                        reject({ status: 404, message: "This task doesn't exists" });
                    else {
                        if (task.id_completed)
                            reject({ status: 409, message: 'You cannot update an already completed task' })
                        else {
                            TaskRepository.cleanAccessById(idTask)
                                .then(() => {
                                    TaskRepository.deleteTaskById(idTask)
                                        .then(() => resolve())
                                        .catch((err) => { reject({ status: 400, message: "Unknown error. Try again later.", err }) });
                                })
                                .catch((err) => { reject({ status: 400, message: "Unknown error. Try again later.", err }) });
                        }
                    }
                }
            }
        });
    }

    assignTask(user: User, idEvent: number, idTask: number): Promise<TaskResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'EQP')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const task = await TaskRepository.findTaskById(idTask);

                    if (!task)
                        reject({ status: 404, message: "This task doesn't exists" });
                    else {
                        if (!task.cd_access_user) {
                            const access = await AccessRepository.findAccessByEventIdAndUserId(idEvent, user.cd_user);

                            TaskRepository.assignTaskByAccessId(idTask, access.cd_access)
                                .then(async (result) => {
                                    const role = await RoleRepository.findRole(access.sg_role);

                                    resolve({
                                        id: result.cd_task,
                                        name: result.nm_task,
                                        completed: result.id_completed,
                                        description: result.ds_task,
                                        user_assigned: {
                                            id: user.cd_user,
                                            name: user.nm_user,
                                            surname: user.nm_surname_user,
                                            role: {
                                                name: role.nm_role,
                                                description: role.ds_role
                                            }
                                        }
                                    });
                                })
                                .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                        } else {
                            reject({ status: 401, message: 'This task already assigned' });
                        }
                    }
                }
            }
        });
    }

    unassignTask(user: User, idEvent: number, idTask: number): Promise<TaskResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'EQP')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const task = await TaskRepository.findTaskById(idTask);

                    if (!task)
                        reject({ status: 404, message: "This task doesn't exists" });
                    else {
                        if (!task.cd_access_user)
                            reject({ status: 401, message: 'This task has not been assigned' });
                        if (task.id_completed)
                            reject({ status: 409, message: "You can't unassign a task that's already completed" })
                        else {
                            if (task.cd_access_user != user.cd_user)
                                reject({ status: 401, message: 'You cannot unassign a task that you did not assign' })
                            else {
                                TaskRepository.cleanAccessById(idTask)
                                    .then((result) => {
                                        resolve({
                                            id: result.cd_task,
                                            name: result.nm_task,
                                            completed: result.id_completed,
                                            description: result.ds_task,
                                            user_assigned: null
                                        });
                                    })
                                    .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                            }
                        }
                    }
                }
            }
        });
    }

    completeAndUncompleteTask(user: User, idEvent: number, idTask: number): Promise<TaskResponse> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const isAllowed = await havePermission(user.cd_user, idEvent, 'EQP')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const task = await TaskRepository.findTaskById(idTask);

                    if (!task)
                        reject({ status: 404, message: "This task doesn't exists" });
                    else {
                        if (!task.cd_access_user && task.cd_access_user != user.cd_user)
                            reject({ status: 401, message: 'To complete or uncomplete a task you need to assign it' });
                        else {
                            const access = await AccessRepository.findAccessByEventIdAndUserId(idEvent, user.cd_user);

                            let taskResponse;
                            const role = await RoleRepository.findRole(access.sg_role);

                            if (!task.id_completed) {
                                await TaskRepository.completeTaskById(idTask)
                                    .then((result) => {
                                        taskResponse = {
                                            id: result.cd_task,
                                            name: result.nm_task,
                                            concluded: result.id_completed,
                                            description: result.ds_task,
                                            user_assigned: {
                                                id: user.cd_user,
                                                name: user.nm_user,
                                                surname: user.nm_surname_user,
                                                role: {
                                                    name: role.nm_role,
                                                    description: role.ds_role
                                                }
                                            }
                                        };
                                    })
                                    .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                            } else {
                                await TaskRepository.uncompleteTaskById(idTask)
                                    .then((result) => {
                                        taskResponse = {
                                            id: result.cd_task,
                                            name: result.nm_task,
                                            concluded: result.id_completed,
                                            description: result.ds_task,
                                            user_assigned: {
                                                id: user.cd_user,
                                                name: user.nm_user,
                                                surname: user.nm_surname_user,
                                                role: {
                                                    name: role.nm_role,
                                                    description: role.ds_role
                                                }
                                            }
                                        };
                                    })
                                    .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                            }

                            resolve(taskResponse);
                        }
                    }
                }
            }
        });
    }
}

export default TaskController;