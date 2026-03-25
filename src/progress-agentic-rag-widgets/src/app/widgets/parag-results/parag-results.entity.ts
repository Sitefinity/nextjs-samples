import { ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Range } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { OffsetStyle } from '@progress/sitefinity-nextjs-sdk/widgets/styling';

const ResultsListSettingsSectionName = 'AI results list settings';

@WidgetEntity('PARAGResults', 'PARAG results')
export class PARAGResultsEntity {
    @ContentSection(ResultsListSettingsSectionName, 0)
    @DisplayName('Results per page')
    @DefaultValue(20)
    @DataType('number')
    @Range(1, 200, 'Value must be between 1 and 200.')
    PageSize: number = 20;

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @ViewSelector([{ Title: 'Default', Name: 'Default', Value: 'Default', Icon: null }])
    @DisplayName('AI results template')
    @DefaultValue('Default')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @Margins('AI results')
    Margins?: OffsetStyle;

    @WidgetLabel()
    SfWidgetLabel: string = 'PARAG results';

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 0)
    @DisplayName('Search results header')
    @DefaultValue('Results for \"{0}\"')
    SearchResultsHeader: string = 'Results for "{0}"';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 1)
    @DisplayName('No results header')
    @DefaultValue('No results for \"{0}\"')
    NoResultsHeader: string = 'No results for "{0}"';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Results number label')
    @DefaultValue('results')
    ResultsNumberLabel: string = 'results';

    @Attributes('Results', 'AI results')
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
