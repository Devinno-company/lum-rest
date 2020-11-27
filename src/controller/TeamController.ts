import TeamMember from "../interfaces/response/TeamMember";
import Access from "../models/Access";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import LinkNotificationRepository from "../repositorys/LinkNotificationRepository";
import NotificationRepository from "../repositorys/NotificationRepository";
import RoleRepository from "../repositorys/RoleRepository";
import TaskRepository from "../repositorys/TaskRepository";
import UserRepository from "../repositorys/UserRepository";
import havePermission from "../utils/havePermission";

class TeamController {

    async readTeam(user: User, idEvent: number): Promise<Array<TeamMember>> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                let isAllowed = false;

                if (event.sg_privacy == "PRI") {
                    await havePermission(user.cd_user, event.cd_event, "EQP")
                        .then(() => isAllowed = true);
                } else
                    isAllowed = true;

                if (!isAllowed)
                    reject({ status: 401, message: "You don't allowed to do so" });
                else {
                    const team: Array<TeamMember> = [];
                    const access = await AccessRepository.findAccessByEventId(event.cd_event);

                    for (let i = 0; i < access.length; i++) {
                        const member = await UserRepository.findUserById(access[i].cd_user);
                        const role = await RoleRepository.findRole(access[i].sg_role);

                        team.push({
                            id: member.cd_user,
                            name: member.nm_user,
                            surname: member.nm_surname_user,
                            profission: member.nm_profission,
                            image: member.im_user,
                            role: {
                                name: role.nm_role,
                                description: role.ds_role
                            }
                        });
                    }

                    resolve(team);
                }
            }
        });
    }

    async readTeamMember(user: User, idEvent: number, idTeamMember: number): Promise<TeamMember> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                let isAllowed = false;

                if (event.sg_privacy == "PRI") {
                    await havePermission(user.cd_user, event.cd_event, "EQP")
                        .then(() => isAllowed = true);
                } else
                    isAllowed = true;


                if (!isAllowed)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else {
                    const access = await AccessRepository.findAccessByEventId(event.cd_event);

                    let contains = false;
                    let accessTeamMember = null;
                    for (let i = 0; i < access.length; i++) {
                        if (access[i].cd_user == idTeamMember) {
                            contains = true;
                            accessTeamMember = access[i];
                        }
                    }

                    if (!accessTeamMember || !contains)
                        reject({ status: 404, message: 'This user is not on the organization team for this event' });
                    else {
                        const userResponse = await UserRepository.findUserById(idTeamMember);
                        const role = await RoleRepository.findRole(accessTeamMember.sg_role);

                        let response: TeamMember = {
                            id: userResponse.cd_user,
                            name: userResponse.nm_user,
                            profission: userResponse.nm_profission,
                            surname: userResponse.nm_surname_user,
                            image: userResponse.im_user,
                            role: {
                                name: role.nm_role,
                                description: role.ds_role
                            }
                        };

                        resolve(response);
                    }
                }
            }
        });
    }

    async updateRoleTeamMember(user: User, idEvent: number, idTeamMember: number, role: string): Promise<TeamMember> {

        return new Promise(async (resolve, reject) => {
            if (role != 'COO' && role != 'EQP')
                reject({ status: 400, message: 'Invalid role.' });
            else {
                const event = await EventRepository.findEventById(idEvent);

                if (!event)
                    reject({ status: 404, message: "This event doesn't exists" });
                else {
                    const access = await AccessRepository.findAccessByEventId(event.cd_event);

                    let contains = false;
                    let accessTeamMember: Access | null = null;
                    for (let i = 0; i < access.length; i++) {
                        if (access[i].cd_user == idTeamMember) {
                            contains = true;
                            accessTeamMember = access[i];
                        }
                    }

                    if (!accessTeamMember || !contains)
                        reject({ status: 404, message: 'This user is not on the organization team for this event' });
                    else {
                        const isAllowed = await havePermission(user.cd_user, idEvent, "CRI");

                        if (!isAllowed)
                            reject({ status: 401, message: "You are not allowed to do so" });
                        else {
                            const newRole = await RoleRepository.findRole(role);
                            const linkNotification = await LinkNotificationRepository
                                .insertLinkNotification(event.cd_event, (role == 'COO' ? 'AFC' : 'AFE'));

                            NotificationRepository.insertNotification({
                                notification_title: "Mudança de cargo!",
                                notification_content: `Agora você é um ${newRole.nm_role} no evento ${event.nm_event}`,
                                notification_read: false
                            }, accessTeamMember.cd_user, linkNotification.cd_link);
                            console.log(accessTeamMember.cd_access, role);

                            AccessRepository.updateRoleById(accessTeamMember.cd_access, role)
                                .then(async (updatedAccess) => resolve(await this.readTeamMember(user, event.cd_event, updatedAccess.cd_user)))
                                .catch((err) => reject({ status: 400, message: "Unknown error. Try again later.", err }));
                        }
                    }
                }
            }
        });
    }

    async deleteTeamMember(user: User, idEvent: number, idTeamMember: number): Promise<TeamMember> {

        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: "This event doesn't exists" });
            else {
                if (idTeamMember == user.cd_user)
                    reject({ status: 400, message: "You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit" })
                else {
                    const access = await AccessRepository.findAccessByEventId(event.cd_event);

                    let contains = false;
                    let accessTeamMember = null;
                    for (let i = 0; i < access.length; i++) {
                        if (access[i].cd_user == idTeamMember) {
                            contains = true;
                            accessTeamMember = access[i];
                        }
                    }

                    if (!accessTeamMember || !contains)
                        reject({ status: 404, message: 'This user is not on the organization team for this event' });
                    else {
                        const isAllowed = await havePermission(user.cd_user, idEvent, "CRI");

                        if (!isAllowed)
                            reject({ status: 401, message: "You are not allowed to do so" });
                        else {
                            const linkNotification = await LinkNotificationRepository.insertLinkNotification(event.cd_event, "RET");
                            NotificationRepository.insertNotification({
                                notification_title: 'Você foi removido da organização de um evento',
                                notification_content: `Você já não participa mais da organização do evento ${event.nm_event}`,
                                notification_read: false
                            }, accessTeamMember.cd_user, linkNotification.cd_link);

                            await TaskRepository.cleanAccessByAccessId(accessTeamMember.cd_access);
                            AccessRepository.deleteAccessById(accessTeamMember.cd_access)
                                .then(() => resolve())
                                .catch((err) => reject({ status: 400, message: "Unknown error. Try again later.", err }));
                        }
                    }
                }
            }
        });
    }
}

export default TeamController;