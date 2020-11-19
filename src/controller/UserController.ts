import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import NewUser from '../interfaces/request/NewUserRequest';
import UserRepository from '../repositorys/UserRepository';
import User from '../models/User';
import Credentials from '../interfaces/request/CredentialsRequest';
import LoginRepository from '../repositorys/LoginRepository';
import UserResponse from '../interfaces/response/UserResponse';
import LocationUserRepository from '../repositorys/LocationUserRepository';
import CityRepository from '../repositorys/CityRepository';
import GeolocationRepository from '../repositorys/GeolocationRepository';
import Nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export default class UserController {

    async newUser(newUser: NewUser) {

        return new Promise(async (resolve, reject) => {
            /* CRIPTOGRAFA A SENHA */
            newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync());
            /* TIRA POSSÍVEIS ESPAÇOS QUE SOBRAM NAS EXTREMIDADES */
            newUser.name = newUser.name.trim();
            newUser.surname = newUser.surname.trim();
            newUser.email = newUser.email.toLowerCase().trim();
            newUser.password = newUser.password.trim();

            const searchUser = await LoginRepository.findLoginByEmail(newUser.email);

            if (!searchUser) {
                const insertedLogin =
                    await LoginRepository.insertLogin(newUser.email, newUser.password)
                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later', err }) });

                if (insertedLogin) {
                    UserRepository.insertUser(newUser, insertedLogin.cd_login)
                        .then((result: User) => {

                            const token = jsonwebtoken.sign({
                                id: result.cd_user
                            }, process.env.SECRET as string);

                            resolve({ token });
                        })
                        .catch(err => reject(err));
                }
            }
            else
                reject({ message: 'This email already register', status: 409 });
        });
    }

    async login(credentials: Credentials): Promise<{ token: string }> {
        credentials.email = credentials.email.toLowerCase();

        return new Promise(async (resolve, reject) => {
            const login = await LoginRepository.findLoginByEmail(credentials.email);

            if (!login)
                reject({ message: 'Incorrect credentials', status: 401 });
            else {
                /* VERIFICA SE A SENHA É CORRETA */
                const valid = bcrypt.compareSync(credentials.password, login.nm_password);

                if (valid) {
                    const user = await UserRepository.findUserByEmail(credentials.email);
                    /* GERA O TOKEN DE AUTENTICAÇÃO */
                    const token = jsonwebtoken.sign({ id: user.cd_user }, process.env.SECRET as string);
                    resolve({ token });
                } else {
                    reject({ message: 'Incorrect credentials', status: 401 });
                }
            }
        });
    }

    async readUserByEmail(email: string): Promise<UserResponse> {

        return new Promise(async (resolve, reject) => {

            const user = await UserRepository.findUserByEmail(email);
            if (!user)
                reject({ status: 404, message: "This user don't exists" });
            else {
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
                    location = null;
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
            }
        });
    }

    async forgotPassword(email: string) {
        return new Promise(async (resolve, reject) => {
            const user = await UserRepository.findUserByEmail(email);

            if (!user)
                reject({ status: 404, message: 'this email does not belong to a user' })
            else {
                const transporter = Nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'company.devinno@gmail.com',
                        pass: 'devinno2020etec#G'
                    }
                });

                const payload = {
                    function: 'RECOVERY_PASSWORD',
                    login_id: user.cd_login
                }

                const token = jwt.sign(payload, 'lum_recovery_password', { expiresIn: '10m' });
                const link = `http://localhost:3000/recoveryPassword?token=${token}`;

                transporter.sendMail({
                    from: 'no-reply@devinno',
                    to: email,
                    subject: 'Recuperação de senha',
                    text: 'salve',
                    html: `<h1>Accesse o link para recuperação de senha:</h1><h3>${link}</h3>`
                })
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => console.log(err));
            }
        });
    }

    recoveryPassword(token: string, newPassword: string) {
        return new Promise(async (resolve, reject) => {
            const verify = jwt.verify(token, 'lum_recovery_password')

            if (!verify)
                reject({ status: 401, message: 'Link de recuperação de senha inválido' })
            else {
                const decoded: any = jwt.decode(token);
                if (decoded.function != 'RECOVERY_PASSWORD')
                    reject({ status: 401, message: 'Invalid token.' })
                else {
                    const passwordEnc = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());

                    LoginRepository.updatePassword(decoded.login_id, passwordEnc)
                        .then(() => resolve())
                        .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }))
                    resolve();
                }
            }

        })
    }
}