import {check} from '@augment-vir/assert';
import {type PartialWithUndefined} from '@augment-vir/common';
import {type SynthNote} from './synth-patch.js';

/** Tempo and meter. Steps are the grid that step strings are written on, usually sixteenths. */
export type SongGrid = Readonly<
    {
        bpm: number;
    } & PartialWithUndefined<{
        /** Defaults to `4`. */
        beatsPerBar: number;
        /** Defaults to `4`, so a step is a sixteenth note. */
        stepsPerBeat: number;
    }>
>;

export function getStepSeconds(grid: SongGrid) {
    return 60 / grid.bpm / (grid.stepsPerBeat ?? 4);
}

export function getStepsPerBar(grid: SongGrid) {
    return (grid.beatsPerBar ?? 4) * (grid.stepsPerBeat ?? 4);
}

export function getBarSeconds(grid: SongGrid) {
    return getStepSeconds(grid) * getStepsPerBar(grid);
}

/**
 * Velocity for each character that starts a note in a step string. Lowercase `s` and uppercase `S`
 * slide into their pitch from the note before instead of starting a new one.
 */
const hitVelocities: Readonly<Record<string, number>> = {
    X: 1,
    x: 0.78,
    o: 0.45,
    S: 1,
    s: 0.78,
};
const slideCharacters = [
    's',
    'S',
];

/**
 * Turns a step string into notes, one character per step:
 *
 * - `X`, `x`, `o`: a note, accented, normal, or ghosted.
 * - `S`, `s`: an accented or normal acid slide. The note before keeps sounding and glides to this
 *   pitch without retriggering, which needs the patch's `glideSeconds`.
 * - `-`: holds the note before for another step.
 * - `.`: a rest.
 *
 * Spaces and `|` are ignored, so bars can be written apart. Each note takes the next of `pitches`,
 * cycling back to the first when they run out.
 *
 * @example SequenceSteps({ grid: {bpm: 120}, pattern: 'x-.X', pitches: [60, 67], }); // A two-step
 * note on 60 at 0 s, then an accented one-step note on 67 at 0.375 s.
 */
export function sequenceSteps({
    gateFraction = 1,
    gateSteps,
    grid,
    pan,
    pattern,
    pitches,
    startStep = 0,
    velocityScale = 1,
}: Readonly<
    {
        grid: SongGrid;
        pattern: string;
        pitches: number | ReadonlyArray<number>;
    } & PartialWithUndefined<{
        /** Where the pattern's first step lands, in steps from the start of the song. */
        startStep: number;
        /** A fixed gate for every note in steps, ignoring holds. Percussion uses this. */
        gateSteps: number;
        /** Shortens each note's written length so consecutive notes don't smear. Defaults to `1`. */
        gateFraction: number;
        velocityScale: number;
        pan: number;
    }>
>): SynthNote[] {
    const stepSeconds = getStepSeconds(grid);
    const pitchList = check.isNumber(pitches)
        ? [
              pitches,
          ]
        : pitches;
    const steps = pattern.replaceAll(/[\s|]/g, '').split('');

    type DraftNote = Readonly<{
        startStep: number;
        lengthSteps: number;
        midi: number;
        velocity: number;
        pitchSteps: ReadonlyArray<Readonly<{atSteps: number; midi: number}>>;
    }>;

    function extendLastNote(
        notes: ReadonlyArray<DraftNote>,
        extend: (note: DraftNote) => Partial<DraftNote>,
    ) {
        const lastNote = notes.at(-1);

        return lastNote
            ? notes.toSpliced(-1, 1, {
                  ...lastNote,
                  ...extend(lastNote),
                  lengthSteps: lastNote.lengthSteps + 1,
              })
            : notes;
    }

    const {notes} = steps.reduce<{
        notes: ReadonlyArray<DraftNote>;
        /** Whether a hold or slide on this step continues the last note. */
        isSounding: boolean;
        hitCount: number;
    }>(
        (state, character, stepIndex) => {
            const velocity = hitVelocities[character];
            const midi = pitchList[state.hitCount % pitchList.length] ?? 0;

            if (velocity == undefined) {
                return character === '-' && state.isSounding
                    ? {
                          ...state,
                          notes: extendLastNote(state.notes, () => {
                              return {};
                          }),
                      }
                    : {
                          ...state,
                          isSounding: false,
                      };
            } else if (slideCharacters.includes(character) && state.isSounding) {
                return {
                    hitCount: state.hitCount + 1,
                    isSounding: true,
                    notes: extendLastNote(state.notes, (lastNote) => {
                        return {
                            pitchSteps: [
                                ...lastNote.pitchSteps,
                                {
                                    atSteps: stepIndex - lastNote.startStep,
                                    midi,
                                },
                            ],
                        };
                    }),
                };
            } else {
                return {
                    hitCount: state.hitCount + 1,
                    isSounding: true,
                    notes: [
                        ...state.notes,
                        {
                            lengthSteps: 1,
                            midi,
                            pitchSteps: [],
                            startStep: stepIndex,
                            velocity: velocity * velocityScale,
                        },
                    ],
                };
            }
        },
        {
            hitCount: 0,
            isSounding: false,
            notes: [],
        },
    );

    return notes.map((note) => {
        return {
            durationSeconds: (gateSteps ?? note.lengthSteps * gateFraction) * stepSeconds,
            midi: note.midi,
            pan,
            pitchSteps: note.pitchSteps.length
                ? note.pitchSteps.map((pitchStep) => {
                      return {
                          atSeconds: pitchStep.atSteps * stepSeconds,
                          midi: pitchStep.midi,
                      };
                  })
                : undefined,
            startSeconds: (startStep + note.startStep) * stepSeconds,
            velocity: note.velocity,
        };
    });
}
