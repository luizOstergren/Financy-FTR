import {
  Pagination as ShadCnPagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "./ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  const handleOnClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number,
  ) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <ShadCnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={currentPage === 1}
            onClick={(e) => handleOnClick(e, currentPage - 1)}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => handleOnClick(e, page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={currentPage === totalPages}
            onClick={(e) => handleOnClick(e, currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadCnPagination>
  );
};