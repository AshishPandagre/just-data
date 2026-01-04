import React from 'react';
import SchemaSettings from '../../components/SchemaSettings';
import { CHART_METADATA } from '../../constants';

const PieSettings = ({ option, onChange }) => {
    return (
        <SchemaSettings
            option={option}
            onChange={onChange}
            schema={CHART_METADATA.pie.settingsSchema}
        />
    );
};

export default PieSettings;
