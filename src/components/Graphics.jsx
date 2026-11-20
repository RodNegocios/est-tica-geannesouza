import React from 'react';

export function Flower({className = ''}) {
  return <svg className={className} viewBox="0 0 54 64" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M27 3C13 15 15 29 27 39 39 29 41 15 27 3Z"/>
    <path d="M27 40C13 39 6 29 6 20c12 1 21 10 21 20Zm0 0c14-1 21-11 21-20-12 1-21 10-21 20ZM27 15v43m-10-6q10-5 20 0"/>
    <path d="M27 47C17 47 8 43 4 35c10 0 19 3 23 12Zm0 0c10 0 19-4 23-12-10 0-19 3-23 12Z"/>
  </svg>
}

const paths = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v5m10-5v5M3 11h18m-13 5h3"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".9" fill="currentColor" stroke="none"/></>,
  chat: <><path d="M4 16.5a8.8 8.8 0 1 1 3.6 3.3L3.2 21z"/><path d="M8.2 7.7c-.8.8-.4 2.7 1.7 5s4.5 3.5 5.7 2.5l.7-1.1-2.4-1.2-.9.9c-1.4-.6-2.8-1.9-3.4-3.4l.7-.7-1-2.3z"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="m5 5 14 14M19 5 5 19"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  left: <path d="m14 6-6 6 6 6"/>,
  right: <path d="m10 6 6 6-6 6"/>,
  clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  play:<path d="M8 5v14l11-7z"/>,
  pause:<><path d="M8 5v14m8-14v14" strokeWidth="3"/></>,
  sound:<><path d="m4 9 3 0 5-4v14l-5-4H4zM16 9q3 3 0 6m2-9q6 6 0 12"/></>,
  mute:<><path d="M4 9h3l5-4v14l-5-4H4zM16 10l5 5m0-5-5 5"/></>,
  book:<><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/></>,
  image:<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 5-5 3 3 4-6 5 6"/></>
};
export function Icon({name,size=19}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function Spark() {
  return <svg className="spark" width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 1c.6 5.5 3.5 8.4 9 9-5.5.6-8.4 3.5-9 9-.6-5.5-3.5-8.4-9-9 5.5-.6 8.4-3.5 9-9Z" stroke="currentColor"/></svg>;
}
