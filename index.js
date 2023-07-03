import { Client } from "discord.js";
import dotenv from "dotenv";
import { arrayCommands } from "./commands/index.js";

dotenv.config();

const token = process.env.TOKEN;

const client = new Client();

//Logear el bot
client.login(token);

client.on("ready", async () => {
    console.log("El bot se ha iniciado como", client.user.username);
    client.user.setPresence({
        status: "online",
        activity: {
            name: "Minecraft peru",
            type: "PLAYING"
        },
    })
});

const prefix = "-";

client.on("message", async (message) => {

    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    message.author.createdA
    const content = message.content.slice(prefix.length);
    const args = content.toLowerCase().split(" ");
    const commandName = args.shift();
    const commandBody = content.slice(commandName.length);

    if(commandName === "ping"){
        return message.reply("pong!");
    }

    arrayCommands.forEach((command) => {
        if(command.name === commandName || command.alias.includes(commandName)){
            command.execute(message, args);
        }
    })
})