import { Choice, ContentSection, ContentSectionTitles, DataType, DefaultValue, Description, DisplayName, KnownFieldTypes, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';
import { ScriptLocation } from './script-location';

@WidgetEntity('Script', 'Script')
export class ScriptEntity {
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 0)
    @DisplayName('Script location')
    @Description('Select where the script should be placed on the page')
    @Choice([
        { Title: 'Inline', Name: ScriptLocation.Inline, Value: ScriptLocation.Inline },
        { Title: 'Body top', Name: ScriptLocation.BodyTop, Value: ScriptLocation.BodyTop },
        { Title: 'Body bottom', Name: ScriptLocation.BodyBottom, Value: ScriptLocation.BodyBottom }
    ])
    @DefaultValue(ScriptLocation.Inline)
    Location?: string = ScriptLocation.Inline;

    @ContentSection(ContentSectionTitles.LabelsAndMessages, 1)
    @DisplayName('Script')
    @Description('Put the script with its wrapping tag -> e.g. <script>javascript code</script>')
    @DataType(KnownFieldTypes.TextArea)
    Script?: string;
}
