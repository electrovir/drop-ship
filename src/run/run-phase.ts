export enum RunPhase {
    /** The players pick which connected star to travel to next. */
    GalaxyMap = 'galaxy-map',
    /** The ships fly along the hyperlane to the chosen star. */
    Jump = 'jump',
    Build = 'build',
    /** The camera moves from the build panels to the shared fly view. */
    ToFly = 'to-fly',
    Fly = 'fly',
    /** Every ship blew up. The enemies fly away before the galaxy map opens again. */
    Wrecked = 'wrecked',
    /** The star reached the bottom of the screen. Core fragments fly out of it into the ships. */
    Reward = 'reward',
    /**
     * Every reward fragment is collected. The ships fly up off the screen, then the galaxy map
     * opens.
     */
    Depart = 'depart',
}

export const phaseTransitionMs = 750;
export const jumpMs = 1600;
