export const getMemberById = (message, id) => {
    return message.guild.members.cache.get(id)
}

export const getMemberByFilter = (message, filterString) => {
    const filter = filterString.toLowerCase();
    return message.guild.members.cache.find(member => {
        return (member.user.username.toLowerCase().includes(filter) ||
            member.user.tag.toLowerCase().includes(filter) ||
            member.user.id.toLowerCase().includes(filter) ||
            member.displayName.toLowerCase().includes(filter))
    })
}