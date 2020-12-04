import User from "../models/User";

function genNameFile(type: 'profile' | 'event' | 'map', id: number, file_type: string): string {

    const data = new Date()
    const fileName: string =
        `${type}-id-${id}-${data.getDate()}-${data.getMonth()}-${data.getFullYear()}_${data.getHours()}-${data.getMinutes()}-${data.getSeconds()}-${data.getMilliseconds()}${file_type}`;

    return fileName;

}

export default genNameFile;