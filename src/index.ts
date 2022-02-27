import { Intents } from 'discord.js';
import { ExtendedClient } from './structures/Client';
import dotenv from 'dotenv';
dotenv.config();

export const client = new ExtendedClient({ intents: Intents.FLAGS.GUILDS });

client.start();
