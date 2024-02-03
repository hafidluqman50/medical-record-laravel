import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination"

type PaginationProps = {
    link:string;
    previous:number;
    next:number;
    listPagination:number;
    activePage:number;
}

export function PaginationTable({link, previous, next, listPagination, activePage}: PaginationProps) {
    const linkPrevious: string = `${link}/${previous}`
    const linkNext: string = `${link}/${next}`
    return(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={linkPrevious} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={linkNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    )
}