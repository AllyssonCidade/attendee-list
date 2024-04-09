import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IconButton } from './icon-button';
import { Table } from './table/table';
import { TableHead } from './table/table-header';
import { TableCell } from './table/table-cell';
import { TableRow } from './table/table-row';
import { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface Attendee{
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList(){
    const [search, setSearch] = useState(()=>{
        const url = new URL(window.location.toString())

        if(url.searchParams.has('search')){
            return url.searchParams.get('search') ?? ''
        } else {
            return (
                ''
            )
        
        }

    });
    const [page, setPage] = useState(()=>{
        const url = new URL(window.location.toString())

        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page'))
        } else {
            return (
                1
            )
        
        }
    });

    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [total, setTotal] = useState(0);
    
    const totalPages = Math.ceil(total / 10);

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
        url.searchParams.set('pageIndex', String(page -1))
    
        if (search.length > 0){
            url.searchParams.set('query', search)
        }

        fetch(url)
        .then(response=>response.json())
        .then(data => {
            setAttendees(data.attendees)
            setTotal(data.total)
        })
    },[page, search])

    function setCurrentSearch(search: string){
        const url = new URL(window.location.toString())

        url.searchParams.set('search',search)

        window.history.pushState({},"", url)
        setSearch(search)

    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())

        url.searchParams.set('page', String(page))

        window.history.pushState({},"", url)
        setPage(page)
    }

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
        setCurrentSearch(event.target.value);
        setCurrentPage(1)
    }

    function goToFirstPage(){
        setCurrentPage(1);
    }

    function goToLastPage(){
        setCurrentPage(totalPages);
    }
    
    function goToPreviousPage(){
        setCurrentPage(page - 1);
    }
    
        function goToNextPage(){
          setCurrentPage(page + 1)
        }
            return(
                <div className='flex flex-col gap-4'>
                    <div className="flex gap-3 items-center">
                        <h1 className="text-2xl font-bold py-5">Participantes</h1>
                        <div className="px-3 w-72 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm flex items-center gap-3">
                            <Search className="size-4 text-emerald-300"/>
                            <input 
                            value={search}
                            onChange={onSearchInputChanged}
                            className="focus:ring-0 bg-transparent focus:border-0 flex-1 outline-0 border-0 p-0 text-sn ring-0"
                            placeholder="Buscar Participante... " />
                        </div>
                        
                    </div>
                    <Table >
                            <thead>
                                <TableRow>
                                    <TableHead style={{ width:64 }} >
                                        <input  
                                        placeholder='check' 
                                        className='size-4 bg-black/20 roounded border-white/10 checked:bg-orange-400 ' 
                                        type='checkbox'
                                        />
                                    </TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Participantes</TableHead>
                                    <TableHead>Data de Inscrição</TableHead>
                                    <TableHead>Data do check-in</TableHead>
                                    <TableHead style={{ width:64 }} ></TableHead>
                                </TableRow>
                            </thead>
                            <tbody>
                                {attendees.map((attendee) => {
                                    return(
                                        <TableRow key={attendee.id}>
                                            <TableCell>
                                                <input 
                                                placeholder='check' 
                                                className='size-4 bg-black/20 roounded border-white/10 checked:bg-orange-400 ' 
                                                type='checkbox' 
                                                />
                                            </TableCell>
                                            <TableCell>{attendee.id}</TableCell>
                                            <TableCell>
                                            <div className='flex flex-col gap-1'>
                                                <span className='font-semibold text-white'>{attendee.name}</span>
                                                <span>{attendee.email}</span>
                                            </div>
                                            </TableCell>
                                    
                                            <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                            <TableCell>{attendee.checkedInAt === null 
                                            ? <span className='text-zinc-400'>Não fez check-in</span> 
                                            : dayjs().to(attendee.checkedInAt)}</TableCell>
                                            <TableCell></TableCell>
                                            <IconButton transparent >
                                                <MoreHorizontal className='size-4' />
                                            </IconButton>
                                        </TableRow>
                                        )   
                                })}
                            </tbody>
                            <tfoot>
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        Mostrando {attendees.length} de {total} itens
                                    </TableCell>
                                    <TableCell className='text-right' colSpan={3}>
                                        <div className='inline-flex items-center gap-8'>
                                            <span>
                                               Página {page} de {totalPages}
                                            </span>
                                            <div className='flex gap-1.5'>
                                                <IconButton onClick={goToFirstPage} disabled={page === 1} >
                                                   <ChevronsLeft className='size-4' />
                                                </IconButton>
                                                
                                                <IconButton onClick={goToPreviousPage} disabled={page === 1} >
                                                    <ChevronLeft className='size-4' />
                                                </IconButton>

                                                <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                                    <ChevronRight className='size-4' />
                                                </IconButton>

                                                <IconButton  onClick={goToLastPage} disabled={page === totalPages}>
                                                    <ChevronsRight className='size-4' />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </tfoot>
                    </ Table> 
                </div>
        )
    }