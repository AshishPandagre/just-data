import React from 'react';
import SchemaSettings from '../../components/SchemaSettings';
import { CHART_METADATA } from '../../constants';

const LineSettings = ({ option, onChange }) => {
    return (
        <SchemaSettings
            option={option}
            onChange={onChange}
            schema={CHART_METADATA.line.settingsSchema}
        />
    );
};

export default LineSettings;
