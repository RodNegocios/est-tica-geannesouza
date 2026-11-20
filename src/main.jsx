import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import ScrollStack,{ScrollStackItem} from './components/ScrollStack';
import DriftWall from './components/DriftWall';
import {Flower,Icon,Spark} from './components/Graphics';
import {Film,syncFilms} from './components/Film';
import {gallery,stories,services,media,whatsapp,instagram,map} from './content';
import './site.css';

function Brand() {
  return <a href="#inicio" aria-label="Geanne Souza, início" className="brand"><Flower/><span>Geanne Souza<small>Centro Especializado</small></span></a>;
}
const links=[['inicio','Início'],['portfolio','Portfólio'],['espaco','O espaço'],['contato','Contato']];
function Header() {
  const [menu,setMenu]=useState(false),[active,setActive]=useState('inicio');
  const trigger=useRef(null);
  useEffect(()=>{
    function update(){
      const sections=links.filter(([id])=>document.getElementById(id)?.getBoundingClientRect().top <= innerHeight*.35);
      setActive(sections.at(-1)?.[0]||'inicio');
    }
    function escape(e){if(e.key==='Escape'){setMenu(false);trigger.current?.focus();}}
    function resize(){if(innerWidth>760)setMenu(false);update();}
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',resize);
    if(menu)window.addEventListener('keydown',escape);
    update();
    return ()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',resize);window.removeEventListener('keydown',escape);};
  },[menu]);
  return <header className="header"><div className="container header-inner"><Brand/><nav id="navigation" aria-label="Navegação principal" className={menu?'nav open':'nav'}>{links.map(([id,label])=><a key={id} className={id===active?'active':''} href={'#'+id} aria-current={id===active?'location':undefined} onClick={()=>setMenu(false)}>{label}</a>)}</nav><div className="header-actions"><a href={whatsapp} className="header-book" aria-label="Agendar horário"><Icon name="calendar" size={17}/><span>Agendar<span className="booking-extra"> horário</span></span></a><button ref={trigger} type="button" className="menu-toggle" aria-expanded={menu} aria-controls="navigation" aria-label={menu?'Fechar menu':'Abrir menu'} onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'}/></button></div></div></header>;
}
function Hero() {
  const host=useRef(null);
  useEffect(()=>{
    const hero=host.current, motion=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0, px=0;
    const draw=()=>{
      frame=0;
      const depth=motion.matches?0:Math.max(-40,Math.min(-hero.getBoundingClientRect().top,hero.offsetHeight));
      hero.style.setProperty('--sky-shift',depth*.12+'px');hero.style.setProperty('--wall-shift',depth*.09+'px');
      hero.style.setProperty('--name-shift',depth*.042+'px');hero.style.setProperty('--hand-shift',depth*.021+'px');
      hero.style.setProperty('--pointer',motion.matches?'0px':px+'px');
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};
    const move=e=>{if(e.pointerType==='mouse'){px=(e.clientX/innerWidth-.5)*5;schedule();}};
    const leave=()=>{px=0;schedule();};
    window.addEventListener('scroll',schedule,{passive:true});hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);motion.addEventListener('change',schedule);draw();
    return ()=>{window.removeEventListener('scroll',schedule);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);motion.removeEventListener('change',schedule);cancelAnimationFrame(frame);};
  },[]);
  const source=media('fachada-850.webp')+' 850w, '+media('fachada.webp')+' 1647w';
  return <section className="hero" id="inicio" ref={host} aria-labelledby="hero-title">
    <div className="scene"><div className="scene-image"><img className="sky" src={media('fachada.webp')} srcSet={source} sizes="(max-width: 700px) 850px, 88vw" alt="Fachada do Centro Especializado Geanne Souza em Vilhena, com palmeiras e o nome no muro" fetchPriority="high"/><img className="wall" src={media('fachada.webp')} srcSet={source} sizes="(max-width: 700px) 850px, 88vw" alt="" aria-hidden="true"/></div></div>
    <div className="shade"></div>
    <div className="container hero-inner">
      <div className="hero-copy">
        <div className="kicker hero-kicker"><span className="rule"/>Estética &amp; bem-estar</div>
        <h1 id="hero-title"><span>Geanne</span>{' '}<em>Souza</em></h1>
        <p>Beleza e cuidado em Vilhena, do seu momento de pausa ao dia do seu casamento.</p>
        <div className="hero-actions"><a href="#portfolio" className="button honey">Conhecer o portfólio</a><a href="#espaco" className="hero-link">Conheça o espaço</a></div>
      </div>
      <a className="print" href="#portfolio" aria-label="Ver as histórias do Dia da Noiva"><span className="tape"/><img src={media('renda-e-veu-480.webp')} width="144" height="148" alt=""/><span>Dia da Noiva</span></a>
      <div className="hero-foot"><div><Icon name="pin" size={16}/>Vilhena, Rondônia</div><a href="#portfolio"><span className="scroll-mark"/>Role para explorar</a></div>
    </div>
  </section>;
}
function SectionLabel({children}){return <div className="kicker section-label"><span className="rule"/>{children}</div>;}
function Photo({name,alt,className='',...props}) {
  const hasSmall=!['antes-do-altar','entre-risos','mesa-do-spa'].includes(name);
  return <img className={className} src={media(name+'.webp')} srcSet={hasSmall?media(name+'-480.webp')+' 480w, '+media(name+'.webp')+' 1000w':undefined} sizes="(max-width: 700px) 90vw, 45vw" alt={alt} loading="lazy" decoding="async" {...props}/>;
}
function Portfolio({openStory}) {
  return <section id="portfolio" className="portfolio section"><div className="container">
    <div className="section-head"><div><SectionLabel>Portfólio</SectionLabel><h2>Histórias de <em>noivas</em></h2></div><p>Da primeira conversa ao encontro no altar, um olhar sobre as noivas que passaram por aqui.</p></div>
    <ScrollStack useWindowScroll smoothScroll={false} stackPosition={18} itemStackDistance={9} itemDistance={42} baseScale={.94} itemScale={.019} dimAmount={.075} holdDistance={32}>
    {stories.map((s,i)=><ScrollStackItem key={s.title} itemClassName={'story-card story-'+i}>
      <div className={'story-media '+(s.video?'with-film':s.images.length>1?'diptych':'solo')}>
        {s.video ? <><Film name={s.video} title={s.title}/>{i===1&&<Photo name={s.images[0]} alt={s.alt[0]}/>}</> : s.images.map((n,j)=><Photo key={n} name={n} alt={s.alt[j]}/>)}
      </div>
      <div className="story-copy"><div className="story-type"><Spark/>{s.category}</div><h3>{s.title}</h3><p>{s.excerpt}</p><button className="text-button" onClick={()=>openStory(i)}><Icon name="book" size={17}/>Ler a história</button></div>
    </ScrollStackItem>)}
    </ScrollStack>
  </div></section>;
}
function useMatch(query){
 const [matches,setMatches]=useState(()=>matchMedia(query).matches);
 useEffect(()=>{const mq=matchMedia(query); const onChange=()=>setMatches(mq.matches);mq.addEventListener('change',onChange);onChange();return ()=>mq.removeEventListener('change',onChange);},[query]);
 return matches;
}
function Mural({openPhoto,modalOpen}) {
  const small=useMatch('(max-width: 700px)'), reduced=useMatch('(prefers-reduced-motion: reduce)');
  const [paused,setPaused]=useState(false);
  return <section className="mural section" id="galeria"><div className="container"><div className="section-head"><div><SectionLabel>Galeria</SectionLabel><h2>Olhar de <em>perto</em></h2></div><div className="mural-actions"><button className="text-button" onClick={()=>openPhoto(0)}><Icon name="image"/>Abrir galeria</button>{!reduced&&<button className="toggle-wall" onClick={()=>setPaused(!paused)} aria-label={paused?'Retomar movimento do mural':'Pausar movimento do mural'} aria-pressed={paused}><Icon name={paused?'play':'pause'} size={16}/></button>}</div></div></div>
    <div className="wall-wrap"><DriftWall items={gallery} columns={small?3:6} tileWidth={small?147:245} tileHeight={small?175:236} gap={small?10:17} radius={2} tilt={4} turn={-5} roll={-5} perspective={1400} depth={5} speed={15} variance={.42} parallax={.26} lift={12} fade={.06} dim={.96} overlayColor="transparent" paused={paused||modalOpen} onSelect={item=>openPhoto(item.index)}/></div>
  </section>;
}
function Space(){
  return <section id="espaco" className="space section"><div className="container space-grid"><div className="spa-film"><Film name="mesa-do-spa" title="A mesa de café do Spa Day"/><div className="spa-label"><Spark/><span>Uma pausa no Spa Day</span></div></div>
    <div className="space-copy"><SectionLabel>O espaço</SectionLabel><h2>Tempo para <em>você</em></h2><p>No Jardim América, em Vilhena, o Centro Especializado reúne estética, beleza e bem-estar. No Spa Day, há tempo até para sentar à mesa e saborear o café.</p>
    <div className="service-list">{services.map(([title,body])=><details key={title} name="cuidados"><summary>{title}<Icon name="plus" size={17}/></summary><p>{body}</p></details>)}</div>
    <a href={whatsapp} className="button dark"><Icon name="calendar" size={17}/>Agendar meu horário</a></div></div></section>;
}
function Footer(){
  return <footer id="contato"><div className="container"><div className="contact-grid"><div><SectionLabel>Contato</SectionLabel><h2>Vamos <em>conversar?</em></h2><a className="contact-phone" href={whatsapp}><Icon name="chat"/>(69) 99261-5718</a></div><div className="address"><h3>Visite o centro</h3><p>Rua Carlos de Obregon, 322<br/>Jardim América · Vilhena, RO</p><a href={map}>Ver no Google Maps</a></div><div className="address"><h3>Atendimento</h3><p>Segunda a sábado<br/>Das 8h às 18h</p><a href={instagram}><Icon name="instagram" size={16}/> Instagram</a></div></div><div className="footer-end"><Brand/><a href="#inicio">Voltar ao início</a></div></div></footer>;
}
function Overlay({state,close,changePhoto}) {
  const dialog=useRef(null), originalFocus=useRef(null);
  const isPhoto=state?.type==='photo', open=Boolean(state);
  useLayoutEffect(()=>{
    const el=dialog.current;
    if(open){
      originalFocus.current=document.activeElement;el.showModal();document.documentElement.classList.add('modal-open');syncFilms();
      return ()=>{el.close();document.documentElement.classList.remove('modal-open');originalFocus.current?.focus({preventScroll:true});syncFilms();};
    }
  },[open]);
  const story=state?.type==='story'&&stories[state.index],photo=isPhoto&&gallery[state.index];
  function key(e){if(!isPhoto)return;if(e.key==='ArrowLeft')changePhoto(-1);if(e.key==='ArrowRight')changePhoto(1);}
  return <dialog ref={dialog} onKeyDown={key} className={isPhoto?'overlay lightbox':'overlay'} aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    {state&&<div className="dialog-content"><button className="close-modal" aria-label="Fechar" onClick={close}><Icon name="close"/></button>
    {story ? <><Photo name={story.images[0]} alt={story.alt[0]} className="dialog-story-img"/><div className="dialog-copy"><SectionLabel>{story.category}</SectionLabel><h2 id="dialog-title">{story.title}</h2>{story.details.map(p=><p key={p}>{p}</p>)}</div></> : <><Photo name={photo.name} alt={photo.title} className="lightbox-img" sizes="(max-width: 800px) 95vw, 800px"/><div className="gallery-controls"><button aria-label="Foto anterior" onClick={()=>changePhoto(-1)}><Icon name="left"/></button><div aria-live="polite"><h2 id="dialog-title">{photo.title}</h2><small>{state.index+1} de {gallery.length}</small></div><button aria-label="Próxima foto" onClick={()=>changePhoto(1)}><Icon name="right"/></button></div></>}
    </div>}
  </dialog>;
}
function App(){
  const [modal,setModal]=useState(null),[float,setFloat]=useState(false);
  useEffect(()=>{const ob=new IntersectionObserver(([e])=>setFloat(!e.isIntersecting));ob.observe(document.querySelector('.hero'));return ()=>ob.disconnect();},[]);
  return <><a className="skip" href="#portfolio">Ir para o portfólio</a><Header/><main><Hero/><Portfolio openStory={index=>setModal({type:'story',index})}/><Mural openPhoto={index=>setModal({type:'photo',index})} modalOpen={!!modal}/><Space/></main><Footer/>{float&&<a className="floating" href={whatsapp} aria-label="Agendar pelo WhatsApp"><Icon name="chat" size={23}/></a>}<Overlay state={modal} close={()=>setModal(null)} changePhoto={n=>setModal(s=>({...s,index:(s.index+n+gallery.length)%gallery.length}))}/></>;
}
createRoot(document.getElementById('root')).render(<App/>);
