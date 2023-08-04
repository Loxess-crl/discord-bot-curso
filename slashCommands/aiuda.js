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
  category: "Utility",

  async execute(interaction) {
    const categories = [
      "Actions",
      "Reactions",
      "Random",
      "Fun",
      "Moderation",
      "Utility",
    ];

    const embed = getEmbedByCategory(categories[0]);

    const cancelButton = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Danger);

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Siguiente")
      .setStyle(ButtonStyle.Primary);

    const menuOptions = new StringSelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Selecciona una categoría");

    categories.forEach((category) => {
      menuOptions.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(category)
          .setValue(category)
          .setDescription(`Comandos de la categoría ${category}`)
      );
    });

    const ButtonComponents = new ActionRowBuilder().addComponents(
      cancelButton,
      nextButton
    );

    const menuComponents = new ActionRowBuilder().addComponents(menuOptions);

    const response = await interaction.reply({
      embeds: [embed],
      components: [menuComponents, ButtonComponents],
    });

    const collector = await response.createMessageComponentCollector({
      /* componentType: ComponentType.StringSelect, */
      time: 3_600_000,
    });

    collector.on("collect", async (componentInteraction) => {

      if(componentInteraction.user.id !== interaction.user.id){
        await componentInteraction.followUp({
          content: "No puedes usar este comando",
          ephemeral: true,
        });
        return;
      }

      if(componentInteraction.isStringSelectMenu()){
        const category = componentInteraction.values[0];
        const embed = getEmbedByCategory(category);
        return response.edit({
          embeds: [embed],
        });
      }

      if(!componentInteraction.isButton()) return;

      if (componentInteraction.customId === "cancel") {
        await response.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ayuda")
              .setDescription("Comando cancelado")
              .setColor(Colors.Red)
              .setTimestamp(),
          ],
          components: [],
        });
        return collector.stop("cancel");
      }

      if (componentInteraction.customId === "next") {
        const index = categories.indexOf(componentInteraction.values[0]);
        const nextCategory = categories[index + 1];
        const embed = getEmbedByCategory(nextCategory);

        await componentInteraction.update({
          embeds: [embed],
          components: [components],
        });
        return;
      }
    });
  },
};

function getEmbedByCategory(category) {
  const embed = new EmbedBuilder()
    .setTitle("Ayuda")
    .setDescription(`Comandos disponibles para ${category}`)
    .setColor(0x0099ff)
    .setTimestamp();

  const commands = arraySlashCommands.filter(
    (command) => command.category === category
  );
  if (!commands || commands.length === 0) {
    return embed.setDescription(`No hay comandos disponibles para ${category}`);
  }

  commands.forEach((command) => {
    embed.addFields({ name: command.data.name, value: command.data.description });
  });

  return embed;
}
