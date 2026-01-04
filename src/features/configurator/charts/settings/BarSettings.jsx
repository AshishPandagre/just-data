import React from 'react';
import SchemaSettings from '../../components/SchemaSettings';
import { CHART_METADATA } from '../../constants';

const BarSettings = ({ option, onChange }) => {
    return (
        <SchemaSettings
            option={option}
            onChange={onChange}
            schema={CHART_METADATA.bar.settingsSchema}
        />
    );
};

export default BarSettings;
