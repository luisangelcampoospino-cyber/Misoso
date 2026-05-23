import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { BotClient, Command } from "./types.js";
import { logger } from "../lib/logger.js";

import onReady from "./events/ready.js";
import onInteractionCreate from "./events/interactionCreate.js";
import onGuildMemberAdd from "./events/guildMemberAdd.js";
import onGuildMemberRemove from "./events/guildMemberRemove.js";
import onMessageCreate from "./events/messageCreate.js";

// Moderación
import ban from "./commands/moderacion/ban.js";
import kick from "./commands/moderacion/kick.js";
import warn from "./commands/moderacion/warn.js";
import purge from "./commands/moderacion/purge.js";
import timeout from "./commands/moderacion/timeout.js";
import unban from "./commands/moderacion/unban.js";
import slowmode from "./commands/moderacion/slowmode.js";

// Entretenimiento
import ocho from "./commands/entretenimiento/ocho.js";
import dado from "./commands/entretenimiento/dado.js";
import chiste from "./commands/entretenimiento/chiste.js";
import moneda from "./commands/entretenimiento/moneda.js";
import ruleta from "./commands/entretenimiento/ruleta.js";
import trivia from "./commands/entretenimiento/trivia.js";
import numero from "./commands/entretenimiento/numero.js";
import encuesta from "./commands/entretenimiento/encuesta.js";
import ship from "./commands/entretenimiento/ship.js";

// Economía
import balance from "./commands/economia/balance.js";
import daily from "./commands/economia/daily.js";
import transferir from "./commands/economia/transferir.js";
import ranking from "./commands/economia/ranking.js";
import trabajar from "./commands/economia/trabajar.js";
import robar from "./commands/economia/robar.js";

// Niveles
import rango from "./commands/niveles/rango.js";
import rankingnivel from "./commands/niveles/rankingnivel.js";

// Información
import userinfo from "./commands/informacion/userinfo.js";
import serverinfo from "./commands/informacion/serverinfo.js";
import avatar from "./commands/informacion/avatar.js";
import roleinfo from "./commands/informacion/roleinfo.js";

// Utilidades
import ping from "./commands/utilidades/ping.js";
import uptime from "./commands/utilidades/uptime.js";
import ayuda from "./commands/utilidades/ayuda.js";
import recordarme from "./commands/utilidades/recordarme.js";
import calculadora from "./commands/utilidades/calculadora.js";
import say from "./commands/utilidades/say.js";

// Configuración
import autorole from "./commands/config/autorole.js";
import bienvenida from "./commands/config/bienvenida.js";
import automod from "./commands/config/automod.js";

export function startBot(): void {
  const token = process.env["DISCORD_TOKEN"];
  if (!token) {
    logger.error("DISCORD_TOKEN no está configurado. El bot no puede iniciarse.");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.GuildMember, Partials.User, Partials.Message, Partials.Reaction],
  }) as BotClient;

  client.commands = new Collection<string, Command>();
  client.xpCooldowns = new Set<string>();

  const allCommands: Command[] = [
    // Moderación
    ban, kick, warn, purge, timeout, unban, slowmode,
    // Entretenimiento
    ocho, dado, chiste, moneda, ruleta, trivia, numero, encuesta, ship,
    // Economía
    balance, daily, transferir, ranking, trabajar, robar,
    // Niveles
    rango, rankingnivel,
    // Información
    userinfo, serverinfo, avatar, roleinfo,
    // Utilidades
    ping, uptime, ayuda, recordarme, calculadora, say,
    // Configuración
    autorole, bienvenida, automod,
  ];

  for (const cmd of allCommands) {
    client.commands.set(cmd.data.name, cmd);
  }

  client.once("ready", () => onReady(client));
  client.on("interactionCreate", (interaction) => onInteractionCreate(interaction));
  client.on("guildMemberAdd", (member) => onGuildMemberAdd(member));
  client.on("guildMemberRemove", (member) => onGuildMemberRemove(member));
  client.on("messageCreate", (message) => onMessageCreate(message));

  client.login(token).catch((err) => {
    logger.error({ err }, "Error al iniciar sesión en Discord");
  });

  logger.info(`ÆON inicializando con ${allCommands.length} comandos...`);
}
