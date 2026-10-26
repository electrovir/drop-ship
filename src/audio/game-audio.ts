export enum GameAudioChannel {
    Music = 'music',
    Effects = 'effects',
}

export const defaultGameMasterVolume = 0.8;

export const defaultGameAudioVolumeByChannel: Readonly<Record<GameAudioChannel, number>> = {
    [GameAudioChannel.Music]: 0.8,
    [GameAudioChannel.Effects]: 0.8,
};
