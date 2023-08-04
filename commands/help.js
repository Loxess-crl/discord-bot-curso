import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Colors,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  EmbedBuilder,
  ButtonBuilder,
} from "discord.js";
import { arraySlashCommands } from "../slashCommands/index.js";

export const helpCommand = {
  name: "help",
  alias: ["ayuda", "aiuda"],

  async execute(message, args) {
    const categories = [
      "Actions",
      "Reactions",
      "Random",
      "Fun",
      "Moderation",
      "Utility",
    ];

    const initialEmbed = new EmbedBuilder()
      .setTitle("Ayuda")
      .setDescription("Selecciona una categoría")
      .setColor(Colors.Green)
      .setTimestamp();

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
      cancelButton
      /* nextButton */
    );

    const menuComponents = new ActionRowBuilder().addComponents(menuOptions);

    const response = await message.channel.send({
      embeds: [initialEmbed],
      components: [menuComponents, ButtonComponents],
    });

    const collector = await response.createMessageComponentCollector({
      /* componentType: ComponentType.StringSelect, */
      time: 3 * 60 * 1000,
    });

    collector.on("collect", async (componentInteraction) => {
      if (componentInteraction.user.id !== message.author.id) {
        await componentInteraction.fetchReply();
        await componentInteraction.followUp({
          content: "No puedes usar este comando",
          ephemeral: true,
        });
        return;
      }

      if (componentInteraction.isStringSelectMenu()) {
        const category = componentInteraction.values[0];
        const newEmbed = getEmbedByCategory(category, initialEmbed);
        menuOptions.options.forEach((option) => {
          option.setDefault(option.data.label === category);
        });
        menuComponents.setComponents(menuOptions);
        return await componentInteraction.update({
          embeds: [newEmbed],
          components: [menuComponents, ButtonComponents],
        });
      }

      if (!componentInteraction.isButton()) return;

      if (componentInteraction.customId === "cancel") {
        /* await response.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle("Ayuda")
                .setDescription("Comando cancelado")
                .setColor(Colors.Red)
                .setTimestamp(),
            ],
            components: [],
          }); */
        response.delete();
        return collector.stop("cancel");
      }

      /* if (componentInteraction.customId === "next") {
          const index = categories.indexOf(initialEmbed.title);
          const nextCategory = categories[index + 1];
          const embed = getEmbedByCategory(nextCategory, initialEmbed);
  
          await componentInteraction.update({
            embeds: [embed],
          });
          return;
        } */
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "cancel") return;
      await response.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ayuda")
            .setDescription("Tiempo de espera agotado")
            .setColor(Colors.Red)
            .setTimestamp(),
        ],
        components: [],
      });
    });
  },
};

function getEmbedByCategory(category, embed) {
    embed.setTitle(category);
    const commands = arraySlashCommands.filter(
      (command) => command.category.toLowerCase() === category.toLowerCase()
    );
    if (!commands.length) {
      embed.setFields();
      embed.setDescription(`No hay comandos disponibles para ${category}`);
      return embed;
    }
    embed.setDescription(
      `Comandos de la categoría ${category}\nPara más información usa \`/help <comando>\``
    );
    commands.forEach((command) => {
      embed.setFields({
        name: command.data.name,
        value: command.data.description,
      });
    });
  
    return embed;
  }