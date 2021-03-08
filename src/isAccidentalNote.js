import NOTES from './notes';
export default (note) => {
    return NOTES.includes(note) && note.includes('#');
}