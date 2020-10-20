import { PutObjectRequest } from 'aws-sdk/clients/s3';
import bcrypt from 'bcrypt';
import s3 from '../aws/S3';
import Credentials from '../interfaces/request/CredentialsRequest';
import updatePassword from '../interfaces/request/UpdatePasswordRequest';
import UpdateUser from '../interfaces/request/UpdateUserRequest';
import UserResponse from '../interfaces/response/UserResponse';
import User from "../models/User";
import CityRepository from '../repositorys/CityRepository';
import GeolocationRepository from '../repositorys/GeolocationRepository';
import LocationUserRepository from '../repositorys/LocationUserRepository';
import LoginRepository from '../repositorys/LoginRepository';
import UserRepository from '../repositorys/UserRepository';
import genNameFile from '../utils/genNameFile';

class ProfileController {

    async updateUser({ user, updateUser }: { user: User; updateUser: UpdateUser; }): Promise<UserResponse> {

        return new Promise(async (resolve, reject) => {
            /* VERIFICA QUAIS CAMPOS DEVE ATUALIZAR */
            if (!updateUser.name_to || updateUser.name_to.replace('\ \g', '').length == 0 && updateUser.name_to != '')
                updateUser.name_to = user.nm_user
            if (!updateUser.surname_to || updateUser.surname_to.replace('\ \g', '').length == 0 && updateUser.surname_to != '')
                updateUser.surname_to = user.nm_surname_user;
            if (!updateUser.biography_to || updateUser.biography_to.replace('\ \g', '').length == 0 && updateUser.biography_to != '')
                updateUser.biography_to = user.ds_biography;
            if (!updateUser.label_to || updateUser.label_to.replace('\ \g', '').length == 0 && updateUser.label_to != '')
                updateUser.label_to = user.nm_label;
            if (!updateUser.website_to || updateUser.website_to.replace('\ \g', '').length == 0 && updateUser.website_to != '')
                updateUser.website_to = user.ds_website;
            if (!updateUser.profission_to || updateUser.profission_to.replace('\ \g', '').length == 0 && updateUser.profission_to != '')
                updateUser.profission_to = user.nm_profission;
            if ((!updateUser.company_to || updateUser.company_to.replace('\ \g', '').length == 0) && updateUser.company_to != '')
                updateUser.company_to = user.nm_company;

            let location: any = undefined;

            if (!updateUser.location_to && user.cd_location_user) {
                location = await LocationUserRepository.findLocationUserById(user.cd_location_user);
            } else if (updateUser.location_to && user.cd_location_user) {
                location = await LocationUserRepository.updateLocationUser(user.cd_location_user, updateUser.location_to);
            } else if (updateUser.location_to && !user.cd_location_user) {
                if (!updateUser.location_to.city || !updateUser.location_to.geolocation)
                    reject({ message: "City and geolocation it's required", status: 400 });
                else {
                    location = await LocationUserRepository.insertLocationUser({
                        geolocation: {
                            latitude: updateUser.location_to.geolocation.latitude,
                            longitude: updateUser.location_to.geolocation.longitude
                        },
                        city: updateUser.location_to.city
                    }).catch(err => reject(err));
                }
            }

            if (location) {
                const searchCity = await CityRepository.findCityById(location.cd_city);
                const searchGeolocation = await GeolocationRepository.findGeolocationById(location.cd_geolocation);

                // Atualiza a localização do usuário
                await UserRepository.updateLocationUser(user.cd_user, location.cd_location_user);

                location = {
                    city: searchCity.nm_city,
                    uf: searchCity.sg_uf,
                    geolocation: {
                        latitude: searchGeolocation.cd_latitude,
                        longitude: searchGeolocation.cd_longitude
                    }
                }
            }

            /* ATUALIZA O USUÁRIO NO BANCO ATRAVÉS DA CLASSE ESTÁTICA */
            UserRepository.updateUser(user.cd_user, updateUser)
                .then(async (user) =>
                    resolve(await this.readProfile(user)))
                .catch(err => reject(err));
        });
    }

    async deleteUser(user: User, credentials: Credentials) {

        return new Promise(async (resolve, reject) => {

            const login = await LoginRepository.findLoginById(user.cd_login);
            let valid = false;

            if (!login)
                reject({ message: 'Incorrect credentials', status: 409 });
            else {
                valid = bcrypt.compareSync(credentials.password, login.nm_password);

                if (!valid)
                    reject({ message: 'Incorrect credentials', status: 409 });
                else {
                    if (user.cd_login != login.cd_login)
                        reject({ message: 'Is necessary be logged with user for delete your account' })
                    else {
                        UserRepository.deleteUserByEmail(credentials.email)
                            .then(() => resolve())
                            .catch(err => reject(err))
                    }
                }
            }
        });
    }

    async updatePassword(user: User, updatePassword: updatePassword) {

        return new Promise(async (resolve, reject) => {

            const login = await LoginRepository.findLoginById(user.cd_login);

            let valid = false;

            if (!login)
                reject({ message: 'Invalid token. Renew it.', status: 401 });
            else {
                valid = bcrypt.compareSync(updatePassword.password, login.nm_password);

                if (!valid)
                    reject({ message: 'Invalid password', status: 401 });
                else {
                    const hash = bcrypt.hashSync(updatePassword.newPassword, bcrypt.genSaltSync());

                    LoginRepository.updatePassword(user.cd_login, hash)
                        .then(() => { resolve() })
                        .catch(err => reject(err));
                }
            }
        });
    }

    async updateImage(user: User, image: Express.Multer.File): Promise<UserResponse> {

        return new Promise((resolve, reject) => {
            let type = '';
            // Verifica se o formato está certo
            if (image.mimetype == 'image/png')
                type = '.png';
            else
                type = '.jpg';

            // Gera o nome do arquivo e o link que o arquivo será disponibilizado
            const fileName: string = genNameFile(user, type);
            const link = `https://${process.env.BUCKET_NAME}.s3-${process.env.BUCKET_REGION}.amazonaws.com/image/profile/${fileName}`;

            // Configura a request de upload
            const putObjectRequest: PutObjectRequest =
            {
                Bucket: process.env.BUCKET_NAME as string + '/image/profile',
                Key: fileName,
                Body: image.buffer,
                ContentLength: image.size,
                ACL: 'public-read',
                ContentType: (type == 'image/jpeg') ? 'image/jpeg' : 'image/png'
            };

            // Faz o upload o arquivo
            s3.upload(putObjectRequest, async (err: Error) => {
                if (err) {
                    reject({ message: 'Unknow error. Try again later.', error: err });
                } else {
                    // Persiste o link no banco e retorna o link para o usuário
                    UserRepository.addImageById(user.cd_user, link)
                        .then(async (user) => {
                            resolve(await this.readProfile(user));
                        })
                        .catch(e => {
                            reject({ message: 'Unknow error. Try again later.', error: e })
                        });
                }
            });
        });
    }

    async readProfile(user: User): Promise<UserResponse> {
        
        return new Promise(async (resolve) => {
            const login = await LoginRepository.findLoginById(user.cd_login);
            let location;

            if (user.cd_location_user)
                location = await LocationUserRepository.findLocationUserById(user.cd_location_user);

            if (location) {
                const searchCity = await CityRepository.findCityById(location.cd_city);
                const searchGeolocation = await GeolocationRepository.findGeolocationById(location.cd_geolocation);

                location = {
                    city: searchCity.nm_city,
                    uf: searchCity.sg_uf,
                    geolocation: {
                        latitude: searchGeolocation.cd_latitude,
                        longitude: searchGeolocation.cd_longitude
                    }
                }
            } else {
                location = undefined;
            }

            resolve({
                id: user.cd_user,
                name: user.nm_user,
                surname: user.nm_surname_user,
                email: login.nm_email,
                biography: user.ds_biography,
                label: user.nm_label,
                website: user.ds_website,
                image: user.im_user,
                company: user.nm_company,
                location: location
            });
        });
    }
}

export default ProfileController;