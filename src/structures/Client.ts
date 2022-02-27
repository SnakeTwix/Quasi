import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  ClientOptions,
  Collection,
} from 'discord.js';
import { promisify } from 'util';
import { CommandType } from '../typings/Command';
import glob from 'glob';
import { RegisterCommandOptions } from '../typings/Client';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { DEvent } from './DEvent';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  private restReq = new REST({ version: '9' }).setToken(process.env.token!);

  constructor({ intents }: { intents: ClientOptions['intents'] }) {
    super({
      intents,
    });
  }

  start() {
    this.registerListeners();
    this.login(process.env.token);
  }

  private async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  private async registerCommands({
    guildId,
    commands,
  }: RegisterCommandOptions) {
    try {
      if (guildId) {
        await this.restReq.put(
          Routes.applicationGuildCommands(
            process.env.clientId!,
            process.env.guildId!
          ),
          {
            body: commands,
          }
        );
      } else {
        await this.restReq.put(
          Routes.applicationCommands(process.env.clientId!),
          {
            body: commands,
          }
        );
      }
    } catch (e) {
      console.error(e);
      console.log('Something happened when registering commands');
    }
  }

  private async registerListeners() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];

    // Initialize commands
    const commandFiles = await globPromise(
      `${__dirname}/../commands/**/*{.ts,.js}`
    );
    commandFiles.forEach(async (path) => {
      const command: CommandType = await this.importFile(path);

      if (!command.name) return;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.once('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });
    });

    // Register Events
    const eventFiles = await globPromise(
      `${__dirname}/../events/**/*{.ts,.js}`
    );
    eventFiles.forEach(async (path) => {
      const event: DEvent<keyof ClientEvents> = await this.importFile(path);
      console.log(event);
      this.on(event.event, event.run);
    });
  }
}
