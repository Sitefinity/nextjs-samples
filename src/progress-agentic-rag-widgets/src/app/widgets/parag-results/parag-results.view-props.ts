import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { PARAGResultsEntity } from './parag-results.entity';

export interface FindResultItem {
    Title: string;
    Link?: string;
    Order: number;
}

export interface PARAGResultsViewProps<T extends PARAGResultsEntity> extends ViewPropsBase<T> {
    searchResults: FindResultItem[] | null;
    resultsHeader: string;
    resultsNumberLabel: string;
    pageSize: number;
}
