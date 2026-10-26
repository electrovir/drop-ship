export enum EnemyKind {
    /** Flies straight down. */
    Straight = 'straight',
    /** Flies down slowly while shooting at the closest ship. */
    Shooter = 'shooter',
    /** Slow, with lots of hp. */
    Tank = 'tank',
    /** Snakes side to side on its way down. */
    Weaver = 'weaver',
    /** Drifts in, then dives at the closest ship. */
    Diver = 'diver',
    /** Sways across the top of the screen firing bursts until it's destroyed. */
    Boss = 'boss',
}
