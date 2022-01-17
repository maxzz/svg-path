export default function cx(...configs: Array<string | Record<string, boolean>>): string {
    return configs.map((config) => (
        typeof config === 'string'
            ? config
            : Object.keys(config).filter((subKey: string) => config[subKey]).join(' ')),
    ).join(' ');
}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}
