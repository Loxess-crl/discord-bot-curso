import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Colors,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
} from "discord.js";
import { ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { arraySlashCommands } from "./index.js";

export const aiudaCommand = {
  data: new SlashCommandBuilder()
    .setName("aiuda")
    .setDescription("Comando de ayuda uu"),

  async execute(interaction) {

    const commands = arraySlashCommands.map((command) => {
        return {
            name: command.data.name,
            description: command.data.description,
        };
    });
    const embed = new EmbedBuilder()
      .setTitle("Ayuda")
      .setDescription(`Comandos disponibles para Categoría 1`)
      .setColor(0x0099ff)
      .setTimestamp();
    commands.forEach((command) => {
        embed.addFields({ name: command.name, value: command.description});
    });

    const buttons = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Siguiente")
        .setStyle(ButtonStyle.Primary),
    ]);
    const menu = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Selecciona una opción")
        .addOptions(
            new StringSelectMenuOptionBuilder().setLabel("Opción 1").setValue("1").setDescription("Descripción 1").setEmoji("👍").setDefault(true),
            new StringSelectMenuOptionBuilder().setLabel("Opción 2").setValue("2").setDescription("Descripción 2").setEmoji("🤖"),
            new StringSelectMenuOptionBuilder().setLabel("Opción 3").setValue("3").setDescription("Descripción 3").setEmoji("😊"),
        ),
    ]);
    const response = await interaction.reply({ embeds: [embed], components: [buttons, menu] });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
        });

    collector.on("collect", async (i) => {
       const selection = i.values[0];
        return i.channel.send(`Seleccionaste ${selection}`);
    }
    );
  },
};

function setCommandsCategoryEmbed(embed, commands) {
    commands.forEach((command) => {
        embed.addFields({ name: command.name, value: command.description});
    });
}