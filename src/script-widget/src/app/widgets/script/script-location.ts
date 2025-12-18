export const ScriptLocation = {
    Inline: 'Inline',
    BodyTop: 'BodyTop',
    BodyBottom: 'BodyBottom'
} as const;

export type ScriptLocationType = typeof ScriptLocation[keyof typeof ScriptLocation];
