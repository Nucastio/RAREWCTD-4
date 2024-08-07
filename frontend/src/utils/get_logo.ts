export const getLogo = (name: string) => {
    const words = name.split(" ");

    if (words.length === 1) {
        return words[0]?.charAt(0).toUpperCase() ?? "X";
    }

    const initials = words.map(word => word.charAt(0).toUpperCase());

    return initials.join("");
}
