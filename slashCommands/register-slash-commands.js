import { REST, Routes } from "discord.js";
import { arraySlashCommands } from "./index.js";
import { applicationID, token } from "../constants/config.js";

export const registerSlashCommands = async () => {
    try{
        const slashCommands = arraySlashCommands.map((command) => command.data.toJSON());
        const rest = new REST().setToken(token);
        console.log("Empezando a registrar los slash commands...");
        await rest.put(Routes.applicationCommands(applicationID), {body: slashCommands}).then(() => {
        console.log("Slash commands registrados correctamente!");
        }).catch((error) => {
            console.log(error);
        });
        
    }catch(error){
        console.log(error);
    }
}

registerSlashCommands();