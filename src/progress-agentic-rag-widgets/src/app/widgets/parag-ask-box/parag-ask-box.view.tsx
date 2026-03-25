'use client';

import React, { FocusEvent, MouseEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PARAGAskBoxViewProps } from './parag-ask-box.view-props';
import { RootUrlService} from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { classNames } from '@progress/sitefinity-nextjs-sdk';

const dataSfItemAttribute = 'data-sfitem';
const activeAttribute = 'data-sf-active';
const SUGGESTIONS_TRIGGER_CHAR_COUNT = 3;
const DEBOUNCE_DELAY = 300;

export function PARAGAskBoxDefaultView(props: PARAGAskBoxViewProps) {
    const isEdit = props.widgetContext.requestContext.isEdit;
    const [searchItems, setSearchItems] = React.useState<string[]>([]);
    const [dropDownWidth, setDropDownWidth] = React.useState<number | undefined>(undefined);
    const [dropDownShow, setDropDownShow] = React.useState<boolean>(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLUListElement>(null);
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const inputId = React.useId();

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const activeClass = props.activeClass;

    const suggestionsList: string[] = props.suggestions ? JSON.parse(props.suggestions) : [];

    const handleShowDropdown = () => {
        const inputWidth = inputRef.current?.clientWidth;
        setDropDownWidth(inputWidth);
        setDropDownShow(true);
    };

    const handleHideDropdown = (clear: boolean = true) => {
        if (clear) {
            setSearchItems([]);
        }
        setDropDownWidth(undefined);
        setDropDownShow(false);
    };

    const buildResultsUrl = (query: string) => {
        const knowledgeBoxName = props.knowledgeBoxName || '';
        const searchConfigurationName = props.searchConfigurationName;
        const trimmedQuery = query.trim();

        if (props.resultsPageUrl) {
            const separator = props.resultsPageUrl.indexOf('?') === -1 ? '?' : '&';
            let url = props.resultsPageUrl + separator + 'knowledgeBoxName=' + encodeURIComponent(knowledgeBoxName);
            url += '&searchQuery=' + encodeURIComponent(trimmedQuery);
            if (searchConfigurationName) {
                url += '&searchConfigurationName=' + encodeURIComponent(searchConfigurationName);
            }
            return url;
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.set('knowledgeBoxName', knowledgeBoxName);
            params.set('searchQuery', trimmedQuery);
            if (searchConfigurationName) {
                params.set('searchConfigurationName', searchConfigurationName);
            } else {
                params.delete('searchConfigurationName');
            }
            params.delete('page');
            return pathname + '?' + params.toString();
        }
    };

    const sendAnalytics = (query: string) => {
        if ((window as any).DataIntelligenceSubmitScript) {
            (window as any).DataIntelligenceSubmitScript._client.fetchClient.sendInteraction({
                P: 'Search for',
                O: query,
                OM: { PageUrl: location.href }
            });
        }
    };

    const navigateToResults = () => {
        const query = inputRef.current?.value || '';
        if (query && query.trim() && props.knowledgeBoxName) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            sendAnalytics(query.trim());
            handleHideDropdown();
            router.push(buildResultsUrl(query));
        }
    };

    const getSuggestions = (input: HTMLInputElement) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            const requestUrl = `/${RootUrlService.getWebServicePath()}/Default.GetPARAGSuggestions()` +
                '?knowledgeBoxName=' + encodeURIComponent(props.knowledgeBoxName || '') +
                '&searchQuery=' + encodeURIComponent(input.value);

            fetch(requestUrl, { signal })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then((data: { value: string[] }) => {
                            const items = data.value || [];
                            setSearchItems(items);
                            if (items.length) {
                                handleShowDropdown();
                            } else {
                                handleHideDropdown();
                            }
                        });
                    } else {
                        handleHideDropdown();
                    }
                })
                .catch((err) => {
                    if (err?.name !== 'AbortError') {
                        handleHideDropdown();
                    }
                });
        }, DEBOUNCE_DELAY);
    };

    const inputKeydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13 || e.code === 'Enter') {
            navigateToResults();
        }
    };

    const inputKeyupHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const code = e.code;
        const keyCode = e.keyCode;

        if (code !== 'ArrowUp' && code !== 'ArrowDown' && code !== 'Escape' && keyCode !== 13) {
            const searchText = (e.target as HTMLInputElement).value.trim();
            if (searchText.length >= SUGGESTIONS_TRIGGER_CHAR_COUNT) {
                getSuggestions(e.target as HTMLInputElement);
            } else {
                handleHideDropdown();
            }
        }

        if (code === 'ArrowDown' && searchItems.length) {
            handleShowDropdown();
            firstItemFocus();
        } else if (code === 'Escape') {
            handleHideDropdown();
        }
    };

    const handleDropDownClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const content = target.innerText;
        inputRef.current!.value = content;
        handleHideDropdown();
        navigateToResults();
    };

    const handleDropDownKeyUp = (e: React.KeyboardEvent) => {
        const dropdown = dropdownRef.current;
        const key = e.keyCode;
        const activeLinkSelector = `[${dataSfItemAttribute}][${activeAttribute}]`;
        const activeLink = dropdown!.querySelector(activeLinkSelector);

        if (!activeLink) {
            return;
        }

        const previousParent = activeLink.parentElement!.previousElementSibling;
        const nextParent = activeLink.parentElement!.nextElementSibling;

        if (key === 38 && previousParent) {
            e.preventDefault();
            focusItem(previousParent);
        } else if (key === 40 && nextParent) {
            e.preventDefault();
            focusItem(nextParent);
        } else if (key === 13) {
            inputRef.current!.value = (activeLink as HTMLElement).innerText;
            navigateToResults();
            handleHideDropdown();
            inputRef.current!.focus();
        } else if (key === 27) {
            resetActiveClass();
            handleHideDropdown(false);
            inputRef.current!.focus();
        }
    };

    const handleDropDownBlur = (e: FocusEvent) => {
        if (dropdownRef.current != null && !dropdownRef.current.contains(e.relatedTarget as Node)) {
            handleHideDropdown(false);
        }
    };

    const firstItemFocus = () => {
        const dropdown = dropdownRef.current;
        if (dropdown && dropdown.children.length) {
            const item = dropdown.children[0].querySelector(`[${dataSfItemAttribute}]`);
            focusItem(item?.parentElement);
        }
    };

    const focusItem = (item: any) => {
        resetActiveClass();
        const link = item.querySelector(`[${dataSfItemAttribute}]`);
        if (link && activeClass) {
            link.classList.add(...activeClass.split(' '));
        }
        link.setAttribute(activeAttribute, '');
        link.focus();
    };

    const resetActiveClass = () => {
        const dropdown = dropdownRef.current;
        const activeLink = dropdown!.querySelector(`[${activeAttribute}]`);
        if (activeLink && activeClass) {
            activeLink.classList.remove(...activeClass.split(' '));
            activeLink.removeAttribute(activeAttribute);
        }
    };

    const handlePillClick = (suggestion: string) => {
        if (inputRef.current) {
            inputRef.current.value = suggestion;
        }
        navigateToResults();
    };

    return (
      <div {...props.attributes}>
        {props.knowledgeBoxName && (
        <>
          <div className="d-flex gap-3">
            <label htmlFor={inputId} className="visually-hidden">Search</label>
            <input
              type="text"
              id={inputId}
              className="form-control"
              placeholder={props.placeholder}
              aria-label={props.placeholder}
              defaultValue={!isEdit ? (searchParams.get('searchQuery') || '') : undefined}
              ref={inputRef}
              onKeyUp={!isEdit ? inputKeyupHandler : undefined}
              onKeyDown={!isEdit ? inputKeydownHandler : undefined}
              onBlur={!isEdit ? handleDropDownBlur : undefined}
                        />
            <button type="button" className="btn btn-primary" onClick={!isEdit ? navigateToResults : undefined}>
              {props.buttonLabel}
            </button>
          </div>

          {!isEdit && (
          <ul
            className={classNames('border bg-body list-unstyled position-absolute dropdown-menu show', { [props.visibilityClassHidden]: !dropDownShow })}
            role="listbox"
            ref={dropdownRef}
            style={{ width: dropDownWidth }}
            onClick={handleDropDownClick}
            onKeyUp={handleDropDownKeyUp}
            onBlur={handleDropDownBlur}
                        >
            {searchItems.map((item: string, idx: number) => (
                                item && <li key={idx} role="option" aria-selected={false}>
                                  <button className={props.searchAutocompleteItemClass} data-sfitem="" title={item} tabIndex={-1}>{item}</button>
                                </li>
                            ))}
          </ul>
                    )}

          {suggestionsList.length > 0 && (
          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <span className="text-muted">{props.suggestionsLabel}</span>
            {suggestionsList.map((suggestion, i) => (
              <button
                key={i}
                className="badge rounded-pill border-0 text-truncate bg-opacity-10 bg-secondary text-dark fw-normal fs-6 py-2 px-3"
                tabIndex={0}
                title={suggestion}
                onClick={!isEdit ? () => handlePillClick(suggestion) : undefined}
                                >
                {suggestion}
              </button>
                            ))}
          </div>
                    )}
        </>
            )}
      </div>
    );
}
