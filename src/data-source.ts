import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { Channel } from './models/Channel'
import { User } from './models/User'
import { UserConfig } from './models/UserConfig'
import { Post } from './models/Post'
import { Photo } from './models/Photo'
import { Video } from './models/Video'

import config from './config'


export const AppDataSource = new DataSource({
    type: config.db.type,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    synchronize: true,
    logging: true,
    entities: [User, UserConfig, Post, Photo, Video, Channel],
    subscribers: [],
    migrations: [],
})
