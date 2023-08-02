import {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} from "discord.js";
import { arraySlashCommands } from "./slashCommands/index.js";
import { arrayCommands } from "./commands/index.js";
import { token } from "./constants/config.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

client.once(Events.ClientReady, async () => {
  console.log("El bot se ha iniciado como", client.user.username);
  //colocar status dnd
  client.user.setPresence({
    activities: [
      {
        name: "Hola",
        type: ActivityType.Competing,
      },
    ],
    status: PresenceUpdateStatus.Idle,
  });
});

const prefix = "p!";

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content === "hola") return message.reply("Hola, como estas?");
  if (!message.content.startsWith(prefix)) return;
  message.author.createdA;
  const content = message.content.slice(prefix.length);
  const args = content.toLowerCase().split(" ");
  const commandName = args.shift();
  const commandBody = content.slice(commandName.length);

  if (commandName === "ping") {
    return message.reply("pong!");
  }

  arrayCommands.forEach((command) => {
    if (command.name === commandName || command.alias.includes(commandName)) {
      command.execute(message, args);
    }
  });
});

client.on(Events.InteractionCreate, async (interaction) => {

  if(interaction.isButton()){
    await interaction.deferUpdate();
  }

  if(interaction.isCommand()){

    const slashCommand = arraySlashCommands.find((command) => command.data.name === interaction.commandName);
    if(slashCommand){
        try{
            slashCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'Ocurrió un error xd', ephemeral: true});
        }
    }
  }

   
});
//Logear el bot
client.login(token);
