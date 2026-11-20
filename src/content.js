import {stories} from './generated/stories.json';
export {stories};
export const media = name => './media/' + name;
export const whatsapp = 'https://wa.me/5569992615718';
export const instagram = 'https://www.instagram.com/centroespecializadogeannesouza/';
export const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Geanne Souza Centro Especializado, R. Carlos de Obregon, 322, Jardim América, Vilhena RO');
const photographs = [
  ['renda-e-veu','Renda e véu'], ['noiva-01-penteado','O penteado da noiva'], ['buque-vermelho','Buquê de rosas'],
  ['retrato-cachos','Cachos e maquiagem'], ['robe-de-cetim','Retrato em cetim'], ['vestido-cauda','O vestido e a cauda'],
  ['noiva-01-maquiagem','O preparo da pele'], ['penteado-cachos','Detalhe dos cachos'], ['casal-04','Retrato do casal'],
  ['noiva-01-retrato','A noiva com o buquê'], ['vestido-e-janela','O vestido à janela'], ['retrato-florido','Flores e luz natural'],
  ['noiva-01-detalhe','O acabamento do penteado'], ['robe-noiva','O robe da noiva']
];
export const gallery = photographs.map(([name,title],index)=>({name,title,index,image:media(name+'-480.webp')}));
export const services = [
  ['Spa da Noiva','Preparação para o casamento, com momentos de descanso e cuidados de beleza escolhidos junto com a noiva.'],
  ['Maquiagem e cabelos','Maquiagem profissional para festas e casamentos, penteados, tratamentos dos fios e terapia capilar.'],
  ['Estética facial e manicure','Limpeza de pele, dermaplaning e cuidados com as unhas.'],
  ['Spa Day e massagens','Massagem relaxante, reflexologia e massagem nos pés. O Spa Day reúne massagem, banho de hidromassagem e uma pausa para o café.']
];
