export function loadFonts(){
const titleFont = new FontFace('Nos', 'url(assets/font/Nos.ttf)');
document.fonts.add(titleFont);
const basicFont = new FontFace('stat', 'url(assets/font/stat.ttf)');
document.fonts.add(basicFont);
}