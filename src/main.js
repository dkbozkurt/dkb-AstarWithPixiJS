import './style.css'
import GameBase from './GameBase/GameBase.js'

document.addEventListener("DOMContentLoaded", ()=> {
    const gameBase = new GameBase(document.querySelector('canvas.webgl'))
}, {once:true});

export function userClickedDownloadButton()
{
    console.log('External API store call!');
}