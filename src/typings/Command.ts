import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
} from 'discord.js';
import { ExtendedClient } from '../structures/Client';

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  run: RunFunction;
  permissions?: string[];
  data: SlashCommandBuilder;
};

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}
