import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/common/pagination/pagination';

interface VehiclePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => (event: React.MouseEvent) => void;
}

const VehiclePagination = ({
  page,
  totalPages,
  onPageChange,
}: VehiclePaginationProps) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={onPageChange(page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={onPageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={onPageChange(page + 1)}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default VehiclePagination;
