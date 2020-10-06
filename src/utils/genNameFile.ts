import User from "../models/User";

function genNameFile(user: User, type: string): string {

    const data = new Date()
    const fileName: string =
        `profile-id-${user.cd_user}-${data.getDate()}-${data.getMonth()}-${data.getFullYear()}${type}`;

    return fileName;

}

export default genNameFile;