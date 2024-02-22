import { bot } from './bot/bot'
import { client } from './channels/client'
import { AppDataSource } from './data-source'


AppDataSource.initialize()
    .then(() => {
        client
        
        bot.launch();
    })
    .catch((error) => console.log(error))
