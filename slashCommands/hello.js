import { SlashCommandBuilder } from 'discord.js';
export const helloCommand = {
    data: new SlashCommandBuilder().setName('hello').setDescription('Replies with Hello World!'),
    category: 'Fun',
    async execute(interaction) {
        await interaction.reply('Hello World!');
    }
}