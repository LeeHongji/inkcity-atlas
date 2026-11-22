// The film's two cuts: 16:9 (the site and the README) and 1:1 for X's feed (?format=square).
// Shots keep their timing; only the layout and the cameras change.
export const SQ = typeof location !== 'undefined' && new URLSearchParams(location.search).get('format') === 'square';
export const FW = SQ ? 1080 : 1920, FH = 1080;
