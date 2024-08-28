import { SitefinityDataEntity } from './sitefinity-data.entity';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { SdkItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export interface SitefinityDataViewProps<T extends SitefinityDataEntity> extends ViewPropsBase<T> {
    items: SdkItem[];
}
