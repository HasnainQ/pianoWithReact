import { Fragment, useEffect, useState } from 'react';
import InstrumentAudio from './InstrumentAudio';
import  {getKeyboardShortcutsForNote}  from './getKeyboardShortcutsForNote';
import getNotesBetween from './getNotesBetween';
import isAccidentalNote from './isAccidentalNote';

const isRegularKey = event => {
    return !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

const Instrument = ({ instrumentName, startNote, endNote, renderPianoKey, keyboardMap }) => {
    
    const notes = getNotesBetween(startNote, endNote);
    
    const [state, setState] = useState({
        notesPlaying: []
    });

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }, [])

    const getNoteFromKeyboardKey = keyboardKey => {
        return keyboardMap[keyboardKey.toUpperCase()];
    };

    const handleKeyDown = e => {
        if (isRegularKey(e) && !e.repeat) {
            const note = getNoteFromKeyboardKey(e.key);
            if (note) {
                setState({ ...state, notesPlaying: [...state.notesPlaying, note] });
            }
        }
    };

    const handleKeyUp = e => {
        if(isRegularKey(e) && !e.repeat) {
            const note = getNoteFromKeyboardKey(e.key);
            if(note) {
                setState({
                    ...state,
                    notesPlaying: state.notesPlaying.filter(
                        notePlaying => notePlaying !== note
                    )
                });
            }
        }
    };

    const onPlayNoteStart = note => {
        setState({ ...state, notesPlaying: [...state.notesPlaying, note]})
    };

    const onPlayNoteEnd = note => {
        setState({
            ...state,
            notesPlaying: state.notesPlaying.filter(
                notePlaying => notePlaying !== note
            )
        });
    };

    // const onPlayNoteEnd = note => {
    //     setState({
    //         ...state,
    //         notesPlaying: state.notesPlaying.filter(
    //             notePlaying => notePlaying !== note
    //         )
    //     });
    // };
    return (
        <Fragment>
            {notes.map((note) => {
                return (
                 <Fragment key={note}>
                     {renderPianoKey({
                         note,
                         isAccidentalNote: isAccidentalNote(note),
                         isNotePlaying: state.notesPlaying.includes(note),
                         startPlayingNote: () => onPlayNoteStart(note),
                         endPlayingNote: () => onPlayNoteEnd(note),
                         keyboardShortcut: getKeyboardShortcutsForNote(keyboardMap, note)
                     })}
                 </Fragment>
                );
            })}
            <InstrumentAudio 
                instrumentName={instrumentName}
                notes={state.notesPlaying}
            />
        </Fragment>
    );
};

export default Instrument;
