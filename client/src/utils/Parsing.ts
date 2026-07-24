export const parseEnvLine = (line: string) => {
    const cleaned = line.replace(/^export\s+/, "");

    const match = cleaned.match(/^([^=]+?)\s*=\s*(.*)$/);

    if (!match) return null;

    return {
        key: match[1].trim(),
        value: match[2].trim().replace(/^['"]|['"]$/g, ""),
    };
};