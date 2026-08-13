import { memo } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/common/pagination/pagination';

interface VehiclePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VehiclePagination = ({
  page,
  totalPages,
  onPageChange,
}: VehiclePaginationProps) => {
  const handleClick = (targetPage: number) => () => {
    onPageChange(targetPage);
  };

  const getPageNumbers = (
    currentPage: number,
    totalPages: number,
  ): (number | string)[] => {
    // If 7 or fewer pages, show all page numbers
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    // Case 1: Show right ellipsis only (e.g. 1 2 3 4 ... 20)
    if (!showLeftEllipsis && showRightEllipsis) {
      return [1, 2, 3, 4, 'ellipsis-right', totalPages];
    }

    // Case 2: Show left ellipsis only (e.g. 1 ... 17 18 19 20)
    if (showLeftEllipsis && !showRightEllipsis) {
      return [
        1,
        'ellipsis-left',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Case 3: Show both left and right ellipsis (e.g. 1 ... 3 4 5 ... 20)
    return [
      1,
      'ellipsis-left',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis-right',
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handleClick(page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pageNumbers.map((p, index) => {
          if (typeof p === 'string') {
            return (
              <PaginationItem key={`${p}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={handleClick(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={handleClick(page + 1)}
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

export default memo(VehiclePagination);
