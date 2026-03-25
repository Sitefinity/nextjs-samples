'use client';
import { useEffect, useRef, useState } from 'react';
import { PARAGResultsViewProps } from './parag-results.view-props';
import { PARAGResultsEntity } from './parag-results.entity';

function getPageFromUrl(): number {
    if (typeof window === 'undefined') {
        return 1;
    }

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    return page > 0 ? page : 1;
}

function buildPageUrl(page: number): string {
    if (typeof window === 'undefined') {
        return `?page=${page}`;
    }

    const params = new URLSearchParams(window.location.search);
    params.set('page', String(page));
    return window.location.pathname + '?' + params.toString();
}

const DISPLAY_PAGES_COUNT = 10;

function computePagerWindow(currentPage: number, totalPages: number) {
    let startPage = 1;
    if (currentPage > DISPLAY_PAGES_COUNT) {
        startPage = Math.floor((currentPage - 1) / DISPLAY_PAGES_COUNT) * DISPLAY_PAGES_COUNT + 1;
    }
    const endPage = Math.min(totalPages, startPage + DISPLAY_PAGES_COUNT - 1);
    const isPreviousVisible = startPage > DISPLAY_PAGES_COUNT;
    const isNextVisible = endPage < totalPages;
    const previousPageIndex = startPage - 1;
    const nextPageIndex = endPage + 1;
    return { startPage, endPage, isPreviousVisible, isNextVisible, previousPageIndex, nextPageIndex };
}

export function PARAGResultsDefaultView(props: PARAGResultsViewProps<PARAGResultsEntity>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pageSize = props.pageSize;
    const totalCount = props.searchResults?.length ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(getPageFromUrl());

        const handlePopState = (e: PopStateEvent) => {
            const page = (e.state && e.state.page) ? e.state.page : getPageFromUrl();
            setCurrentPage(page);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        setCurrentPage(getPageFromUrl());
    }, [props.searchResults]);

    function navigateToPage(page: number) {
        if (page < 1) {
        page = 1;
        }

        if (totalPages > 0 && page > totalPages) {
        page = totalPages;
        }

        history.pushState({ page }, '', buildPageUrl(page));
        setCurrentPage(page);
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const clampedPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    const start = (clampedPage - 1) * pageSize;
    const end = start + pageSize;
    const pagedResults = props.searchResults?.slice(start, end);
    const displayEnd = Math.min(end, totalCount);

    const { startPage, endPage, isPreviousVisible, isNextVisible, previousPageIndex, nextPageIndex } =
        computePagerWindow(clampedPage, totalPages);

    return (
      <>
        {(props.widgetContext.requestContext.isEdit || props.searchResults !== null) && (
        <div
          ref={containerRef}
          data-sf-role="ai-results"
          {...props.attributes}>
          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 role="alert" aria-live="assertive">{props.resultsHeader}</h1>
          </div>
          <div>
            <h4>{totalCount} {props.resultsNumberLabel}</h4>
          </div>

          {props.searchResults !== null && (
          <>
            <div className="mt-5">
              {pagedResults?.map((item, idx) => {
                                            const hasLink = !!item.Link;
                                            return (
                                              <div className="mb-5" key={idx} data-sf-role="result-item">
                                                <div className="flex-grow-1">
                                                  <h3 className="mb-1">{item.Title}</h3>
                                                  {hasLink && (
                                                  <a className="text-decoration-none" href={item.Link}>{item.Link}</a>
                                                        )}
                                                </div>
                                              </div>
                                            );
                                        })}
            </div>
            {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between" data-sf-role="pager-container">
              <div>
                <nav role="navigation" aria-label="Pagination">
                  <ul className="pagination" data-sf-role="pagination">
                    {isPreviousVisible && (
                    <li className="page-item">
                      <a
                        suppressHydrationWarning={true}
                        className="page-link"
                        href={buildPageUrl(previousPageIndex)}
                        aria-label="Previous"
                        onClick={(e) => {
                          e.preventDefault(); navigateToPage(previousPageIndex);
                      }}>
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    )}
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                      <li key={page} className={`page-item${clampedPage === page ? ' active' : ''}`}>
                        <a
                          suppressHydrationWarning={true}
                          className="page-link"
                          href={buildPageUrl(page)}
                          aria-label={clampedPage === page ? `Page ${page}` : `Go to page ${page}`}
                          aria-current={clampedPage === page ? 'true' : undefined}
                          onClick={(e) => {
                            e.preventDefault(); navigateToPage(page);
                        }}>
                          {page}
                        </a>
                      </li>
                    ))}
                    {isNextVisible && (
                      <li className="page-item">
                        <a
                          suppressHydrationWarning={true}
                          className="page-link"
                          href={buildPageUrl(nextPageIndex)}
                          aria-label="Next"
                          onClick={(e) => {
                            e.preventDefault(); navigateToPage(nextPageIndex);
                          }}>
                          <span aria-hidden="true">&raquo;</span>
                        </a>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
              {totalCount > 0 && (
              <div className="mb-3">
                <em className="text-muted">
                  <span data-sf-role="pager-summary">{start + 1} - {displayEnd}</span>
                  {' '}
                  <span>of {totalCount} {props.resultsNumberLabel}</span>
                </em>
              </div>
              )}
            </div>
            )}
          </>
          )}
        </div>
        )}
      </>
    );
}
