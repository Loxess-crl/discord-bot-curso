import { EmbedBuilder } from "discord.js";
import { convertDateToString } from "../utils/formatDate.js";
import { getMemberById, getMemberByFilter } from "../utils/getUser.js";

export const userInfoCommand = {
  name: "userinfo",
  alias: ["ui", "useri"],

  execute(message, args) {

    const memberMention = message.mentions.members.first();
    let filter;
    if(memberMention){
        filter = memberMention.user.id
    } else if(args[0]) {
        filter = args[0];
    }
    else{
        filter = message.author.id
    }

    if(filter.length < 3) return message.reply("El filtro debe tener al menos 3 caracteres");

    const member = getMemberByFilter(message, filter);

    if(!member) return message.reply("El usuario no existe");
    
    const fechaRegistro = convertDateToString(member.user.createdAt) || 'NaN';
    const fechaIngreso = convertDateToString(member.joinedAt);

    const messageEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Información Bot",
        iconURL: "https://hips.hearstapps.com/hmg-prod/images/cute-cat-photos-1593441022.jpg?crop=1.00xw:0.753xh;0,0.153xh&resize=1200:*"
      }
      )
      .setTitle(`Información de ${member.user.username}`)
      .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
      .setDescription(
        `Información del ususario en el servidor`
      )
      .addFields(
        { name: "Registro", value: fechaRegistro === 'NaN'? '-':fechaRegistro, inline: true },
        { name: "Ingreso", value: fechaIngreso, inline: true }
      )
      .setColor(0x222E50)
      .setFooter({text: `ID: ${filter}`})
      .setTimestamp();

    return message.channel.send({embeds: [messageEmbed]});
  },
};
