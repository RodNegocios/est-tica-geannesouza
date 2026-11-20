import React, {useEffect, useRef, useState} from 'react';
import {media} from '../content';
import {Icon} from './Graphics';

const films = new Map();
let stopWatching;
function watchFilms() {
  let frame;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const select = () => {
    frame = null;
    let best = null, bestScore = 0;
    for (const [video, info] of films) {
      const rect = video.getBoundingClientRect();
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(innerHeight, rect.bottom);
      const ratio = Math.max(0, visibleBottom-visibleTop) / Math.min(innerHeight, rect.height || 1);
      const x = (rect.left + rect.right)/2, y = (visibleTop + visibleBottom)/2;
      const hit = ratio >= .35 && document.elementFromPoint(x,y);
      if (document.hidden || !info.visible || !hit || !video.parentElement.contains(hit)) continue;
      const score = ratio + (info.manual.current === 'play' ? 2 : 0);
      if (score > bestScore) {best = video; bestScore = score;}
    }
    for (const [video, info] of films) {
      const allowAuto = !reduced.matches && !navigator.connection?.saveData;
      const shouldPlay = best === video && info.manual.current !== 'pause' && (allowAuto || info.manual.current === 'play');
      if (shouldPlay) {
        if (!video.hasAttribute('src')) video.src = video.dataset.src;
        if (video.paused && !info.blocked.current) video.play().catch(error => {if (error.name !== 'AbortError') info.blocked.current = true;});
      } else if (!video.paused) video.pause();
    }
  };
  const schedule = () => {if (!frame) frame = requestAnimationFrame(select);};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('scrollend',schedule);
  window.addEventListener('filmvisibility',schedule);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',schedule);
  schedule();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll',schedule);
    window.removeEventListener('resize',schedule);
    window.removeEventListener('scrollend',schedule);
    window.removeEventListener('filmvisibility',schedule);
    document.removeEventListener('visibilitychange',schedule);
    reduced.removeEventListener('change',schedule);
  };
}
export function syncFilms() {window.dispatchEvent(new Event('filmvisibility'));}
export function Film({name,title}) {
  const ref=useRef(null), manual=useRef(null), blocked=useRef(false);
  const [playing,setPlaying]=useState(false), [muted,setMuted]=useState(true), [failed,setFailed]=useState(false);
  useEffect(()=>{
    const video=ref.current;
    const info = {manual, blocked, visible:false};
    films.set(video,info);
    const observer = new IntersectionObserver(([entry]) => {
      info.visible = entry.isIntersecting;
      if (!info.visible) video.pause();
      syncFilms();
    }, {threshold:[0,.35,.65,1]});
    observer.observe(video);
    if(films.size===1) stopWatching=watchFilms();
    syncFilms();
    return ()=>{observer.disconnect();video.pause(); films.delete(video); if(!films.size) stopWatching?.();};
  },[]);
  function togglePlay() {
    const video=ref.current;
    if(playing) {manual.current='pause';video.pause();}
    else {
      manual.current='play';blocked.current=false;
      if(!video.hasAttribute('src')) video.src=video.dataset.src;
      for (const other of films.keys()) if(other!==video) other.pause();
      video.play().catch(()=>{blocked.current=true;});
    }
  }
  return <figure className="film">
    <video ref={ref} data-src={media(name+'.mp4')} poster={media(name+'.webp')} muted={muted} loop playsInline preload="none" aria-label={title}
      onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>
    {failed ? <span className="film-error">Vídeo indisponível</span> : <div className="film-controls">
      <button type="button" onClick={togglePlay} aria-label={(playing?'Pausar':'Reproduzir')+' vídeo: '+title}><Icon name={playing?'pause':'play'} size={17}/></button>
      <button type="button" onClick={()=>setMuted(!muted)} aria-label={(muted?'Ativar':'Desativar')+' som: '+title}><Icon name={muted?'mute':'sound'} size={17}/></button>
    </div>}
  </figure>;
}
