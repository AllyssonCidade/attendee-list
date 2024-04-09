import { ComponentProps } from "react";

interface TableHeadProps extends ComponentProps<'th'>{}

export function TableHead(props: TableHeadProps){
    return(
        <th {...props}
         className='py-3 px-4 text-sm font-semibold text-left' />
    )
}