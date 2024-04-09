import nlwuniteicon from '../assets/nlw-unite-icon.svg';
import { NavLink } from './nav-link';

export function Header(){
    return (
        <div className='flex items-center gap-5 py-2'>
           <img title='nlw-icon' src={nlwuniteicon} />

           <nav className='flex items-center gap-5'>
                <NavLink href="" className="font-medium text-sm text-zinc-300">Eventos</NavLink>
                <NavLink href="" className='font-medium text-sm'>Participantes</NavLink>
           </nav>
        </div>
        )
}
