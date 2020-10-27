import InviteUserRequest from "../interfaces/request/InviteUserRequest";
import InviteResponse from "../interfaces/response/InviteResponse";
import User from "../models/User";
import AccessRepository from "../repositorys/AccessRepository";
import EventRepository from "../repositorys/EventRepository";
import InviteRepository from "../repositorys/InviteRepository";
import RoleRepository from "../repositorys/RoleRepository";
import StatusInvite from "../repositorys/StatusInviteRepository";
import UserRepository from "../repositorys/UserRepository";
import havePermission from "../utils/havePermission";

class InviteController {

    async inviteUser(user: User, idEvent: number, invite: InviteUserRequest): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const event = await EventRepository.findEventById(idEvent);

            if (!event)
                reject({ status: 404, message: 'This event does not exist' });
            else {
                const guest = await UserRepository.findUserByEmail(invite.guest_email);

                if (!guest)
                    reject({ status: 404, message: 'This user does not exist' });
                else {
                    await havePermission(user.cd_user, event.cd_event, 'CRI')
                        .then(() => {
                            switch (invite.role) {
                                case 'CRI':
                                    reject({ status: 400, message: 'Cannot call a user to be the creator of the event' });
                                    break;
                                case 'COO':
                                case 'EQP':
                                    InviteRepository.insertInvite(guest.cd_user, event, invite.role)
                                        .then(() => resolve())
                                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }) });
                                    break;
                                default:
                                    reject({ status: 400, message: 'Invalid role' });
                            }
                        })
                        .catch(() => reject({ status: 401, message: 'You are not allowed do so' }));
                }
            }
        });
    }

    async readInvite(user: User, idInvite: number): Promise<InviteResponse> {

        return new Promise(async (resolve, reject) => {
            const invite = await InviteRepository.findInviteById(idInvite);
            if (invite.cd_user != user.cd_user)
                reject({ status: 401, message: 'You are not allowed do so' });
            else {
                const role = await RoleRepository.findRole(invite.sg_role);
                const status = await StatusInvite.findStatusInvite(invite.sg_status);

                resolve({
                    id: invite.cd_invite,
                    title: invite.nm_title,
                    content: invite.ds_content,
                    role: {
                        name: role.nm_role,
                        description: role.ds_role
                    },
                    status: {
                        name: status.nm_status,
                        description: status.ds_status,
                    },
                    event_id: invite.cd_event
                });
            }
        });
    }

    async readInvites(user: User): Promise<Array<InviteResponse>> {

        return new Promise(async (resolve) => {
            const invites = await InviteRepository.findInvitesByUserId(user.cd_user);
            const invitesResponse: Array<InviteResponse> = [];

            for (let i = 0; i < invites.length; i++) {
                const role = await RoleRepository.findRole(invites[i].sg_role);
                const status = await StatusInvite.findStatusInvite(invites[i].sg_status);

                invitesResponse.push({
                    id: invites[i].cd_invite,
                    title: invites[i].nm_title,
                    content: invites[i].ds_content,
                    role: {
                        name: role.nm_role,
                        description: role.ds_role
                    },
                    status: {
                        name: status.nm_status,
                        description: status.ds_status,
                    },
                    event_id: invites[i].cd_event
                });
            }

            resolve(invitesResponse);
        });
    }

    async choiceInvite(user: User, idInvite: number, choice: string) {

        return new Promise(async (resolve, reject) => {
            const invite = await InviteRepository.findInviteById(idInvite);

            if (!invite)
                reject({ status: 404, message: "This invite don't exists" });
            else {
                if (invite.cd_user != user.cd_user)
                    reject({ status: 401, message: "You are not allowed to do so" });
                else if (invite.sg_status != 'PEN')
                    reject({ status: 409, message: "This invitation has already been answered" });
                else {
                    switch (choice) {
                        case 'accept':
                            AccessRepository.insertAccess(invite.cd_user, invite.cd_event, invite.sg_role)
                                .then(() => {
                                    InviteRepository.updateStatusInvite(invite.cd_invite, 'ACE')
                                        .then(async (result) => {
                                            resolve(await this.readInvite(user, result.cd_invite));
                                        })
                                        .catch((err) => {
                                            reject({ status: 400, message: 'Unknown error. Try again later.', err });
                                        });
                                })
                                .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); });
                            break;
                        case 'reject':
                            InviteRepository.updateStatusInvite(invite.cd_invite, 'REC')
                                .then(async (result) => {
                                    resolve(await this.readInvite(user, result.cd_invite));
                                })
                                .catch((err) => {
                                    reject({ status: 400, message: 'Unknown error. Try again later.', err });
                                });
                            break;
                        default:
                            reject({ status: 400, message: 'Invalid choice.' });
                    }

                }
            }
        });
    }

    deleteInvite(user: User, idInvite: number) {
        return new Promise(async (resolve, reject) => {
            const invite = await InviteRepository.findInviteById(idInvite);

            if (!invite)
                reject({ status: 404, message: "This invite doesn't exists" })
            else {
                if (invite.cd_user != user.cd_user)
                    reject({ status: 401, message: "You are not allowed do so" });
                else {
                    if (invite.sg_status == 'PEN')
                        reject({ status: 400, message: "You can't delete a pending invitation" });
                    else {
                        InviteRepository.deleteInviteById(idInvite)
                            .then(() => { resolve() })
                            .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later.', err }); })
                    }
                }
            }
        });
    }
}

export default InviteController;