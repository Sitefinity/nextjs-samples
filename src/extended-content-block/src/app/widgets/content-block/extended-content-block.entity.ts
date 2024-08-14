import { Category, DisplayName } from '@progress/sitefinity-widget-designers-sdk';
import { ContentBlockEntity } from '@progress/sitefinity-nextjs-sdk/widgets';

export class ExtendedContentBlockEntity extends ContentBlockEntity {
    @DisplayName('Text to append')
    @Category('Advanced')
    TextToAppend: string | null = null;
}
