import newTaskRequest from "../interfaces/request/newTaskRequest";
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

                            let user_assigned: undefined | TeamMember = undefined;

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
                const isAllowed = await havePermission(user.cd_user, idEvent, 'COO')
                    .catch(() => { reject({ status: 401, message: "You are not allowed to do so" }) });

                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const task = await TaskRepository.findTaskById(idTask);

                    let user_assigned: undefined | TeamMember = undefined;

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
                        description: task.ds_task,
                        user_assigned
                    });
                }
            }
        });
    }
}

export default TaskController;