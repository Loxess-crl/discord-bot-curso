import { MessageEmbed } from "discord.js";
import { convertDateToString } from "../utils/formatDate.js";
import { getUserById } from "../utils/getUser.js";

export const userInfoCommand = {
  name: "userinfo",
  alias: ["ui", "useri"],

  execute(message, args) {

    const userMention = message.mentions.members.first();
    let user_id;
    if(userMention){
        user_id = userMention.user.id
    } else if(args[0]) {
        user_id = args[0];
    }
    else{
        user_id = message.author.id
    }

    const user = getUserById(message, user_id);

    if(!user) return message.reply("El usuario no existe");
    
    const fechaRegistro = convertDateToString(user.createdAt) || 'NaN';
    const fechaIngreso = convertDateToString(user.joinedAt);

    const messageEmbed = new MessageEmbed()
      .setAuthor(
        "Información Bot",
        "https://hips.hearstapps.com/hmg-prod/images/cute-cat-photos-1593441022.jpg?crop=1.00xw:0.753xh;0,0.153xh&resize=1200:*"
      )
      .setTitle(`Información de ${user.user.username}`)
      .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
      .setDescription(
        `Información del ususario en el servidor`
      )
      .addFields(
        { name: "Registro", value: fechaRegistro === 'NaN'? '-':fechaRegistro, inline: true },
        { name: "Ingreso", value: fechaIngreso, inline: true }
      )
      .setColor("#222E50")
      .setFooter(`ID: ${user_id}`)
      .setTimestamp();

    return message.channel.send(messageEmbed);
  },
};
