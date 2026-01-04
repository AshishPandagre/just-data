import { ConfigRow, ToggleInput, TextInput, NumberInput, ColorInput, SelectInput, ColorListInput, NamedColorListInput } from './ConfigInputs';

const getValue = (obj, path) => {
    if (!obj || !path) return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current === undefined || current === null) return undefined;
        current = current[key];
    }
    return current;
};

const SchemaSettings = ({ option, onChange, schema }) => {
    return (
        <div className="space-y-4">
            {schema.map((item, idx) => {
                const rawValue = getValue(option, item.path);
                let displayValue = rawValue;
                if (item.valueMap) {
                    // Reverse map: Find key (true/false) where val equals rawValue
                    // Use loose equality or JSON.stringify for complex values? 
                    // Simple equality is enough for primitives: 'total' === 'total'
                    const match = Object.entries(item.valueMap).find(([, v]) => {
                        // Loose equality to handle undefined/null vs undefined
                        // But 'total' === 'total'
                        return v == rawValue;
                    });

                    if (match) {
                        displayValue = match[0] === 'true' ? true : match[0] === 'false' ? false : match[0];
                    } else {
                        // If current rawValue (e.g. undefined) matches the 'false' key in valueMap (undefined), we should find it above.
                        // If not found, fallback.
                        // For Stack: valueMap: { true: 'total', false: undefined }
                        // If rawValue is undefined, match should be ['false', undefined].
                        displayValue = false; // Default fallback
                    }
                }

                const handleChange = (val) => {
                    let finalVal = val;
                    if (item.valueMap) {
                        finalVal = item.valueMap[String(val)];
                    }
                    onChange(item.path, finalVal);
                };

                let InputComponent;
                let extraProps = {};
                switch (item.type) {
                    case 'boolean':
                        InputComponent = ToggleInput;
                        break;
                    case 'number':
                        InputComponent = NumberInput;
                        break;
                    case 'color':
                        InputComponent = ColorInput;
                        break;
                    case 'colorList':
                        InputComponent = ColorListInput;
                        break;
                    case 'seriesColors':
                    case 'dataColors':
                        InputComponent = NamedColorListInput;
                        break;
                    case 'select':
                        InputComponent = SelectInput;
                        extraProps = { options: item.options };
                        break;
                    case 'string':
                    default:
                        InputComponent = TextInput;
                        break;
                }

                return (
                    <ConfigRow key={idx} label={item.label}>
                        <InputComponent value={displayValue || ''} onChange={handleChange} {...extraProps} />
                    </ConfigRow>
                );
            })}
        </div>
    );
};

export default SchemaSettings;
