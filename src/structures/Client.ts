import {
  ApplicationCommandDataResolvable,
  ApplicationCommandPermissionData,
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
      if (!guildId) return;
      await this.restReq.put(
        Routes.applicationGuildCommands(
          process.env.clientId!,
          process.env.guildId!
        ),
        {
          body: commands,
        }
      );
    } catch (e) {
      // @ts-ignore
      console.error(e.rawError.errors[0].options[0].type._errors);
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

      const commandName = command.data.name;
      if (!commandName) return;

      this.commands.set(commandName, command);

      slashCommands.push(command.data.toJSON());
    });

    this.once('ready', async () => {
      await this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });

      await this.addCommandPermissions();
    });

    // Register Events
    const eventFiles = await globPromise(
      `${__dirname}/../events/**/*{.ts,.js}`
    );
    eventFiles.forEach(async (path) => {
      const event: DEvent<keyof ClientEvents> = await this.importFile(path);
      this.on(event.event, event.run);
    });
  }

  private async addCommandPermissions() {
    // Add permissions to commands
    const commands = await this.guilds.cache
      .get(process.env.guildId!)
      ?.commands.fetch();

    commands?.forEach((command) => {
      let permissions = this.commands.get(command.name)?.permissions;

      if (!permissions) return;

      const fullPermissions = permissions.map<ApplicationCommandPermissionData>(
        (permission) => ({
          id: permission,
          permission: true,
          type: 'ROLE',
        })
      );

      command.permissions.add({
        permissions: fullPermissions,
      });
    });
  }
}
