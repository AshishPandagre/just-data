import { useState } from 'react';
import * as XLSX from 'xlsx';

export const useExcelParser = (initialState = {}) => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(initialState.data || []);
    const [columns, setColumns] = useState(initialState.columns || []);
    const [columnTypes, setColumnTypes] = useState(initialState.columnTypes || {});

    const processFile = (selectedFile) => {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Parse as objects for easier consumption by charts and data grid
            // cellDates: true ensures dates are parsed as Date objects
            const jsonData = XLSX.utils.sheet_to_json(sheet, { cellDates: true });

            if (jsonData.length > 0) {
                const cols = Object.keys(jsonData[0]);
                setColumns(cols);
                setData(jsonData);

                // Initial type inference (Scan up to 10 rows)
                const types = {};
                const sampleRows = jsonData.slice(0, 10);

                cols.forEach((col) => {
                    let isDate = false;
                    let isMeasure = true; // Assume measure until proven otherwise
                    let hasValues = false;

                    for (const row of sampleRows) {
                        const val = row[col];
                        if (val === undefined || val === null || val === '') continue;
                        hasValues = true;

                        // Check Date
                        // 1. Native Date object
                        if (val instanceof Date) {
                            isDate = true;
                            break;
                        }

                        // 2. String Date with RegEx
                        if (typeof val === 'string') {
                            // Matches YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY
                            // Also verifies it's not just a pure number (though regex enforces separators)
                            const dateRegex = /^(\d{4}[-/]\d{1,2}[-/]\d{1,2})|(\d{1,2}[-/]\d{1,2}[-/]\d{4})/;
                            if (dateRegex.test(val)) {
                                const parsed = Date.parse(val);
                                // Additional sanity: check if valid date (Optional, but good)
                                if (!isNaN(parsed)) {
                                    isDate = true;
                                    break;
                                }
                            }
                        }

                        // Check Measure
                        // If any non-empty value is NOT a number, it's not a measure
                        const isNum = typeof val === 'number' || (!isNaN(parseFloat(val)) && isFinite(val));
                        if (!isNum) {
                            isMeasure = false;
                        }
                    }

                    if (isDate) {
                        types[col] = 'date';
                    } else if (isMeasure && hasValues) {
                        types[col] = 'measure';
                    } else {
                        types[col] = 'dimension';
                    }
                });
                setColumnTypes(types);
            }
        };
        reader.readAsBinaryString(selectedFile);
    };

    const toggleColumnType = (column) => {
        setColumnTypes(prev => {
            const current = prev[column];
            let next = 'dimension';
            if (current === 'dimension') next = 'date';
            else if (current === 'date') next = 'measure';
            else if (current === 'measure') next = 'dimension';

            return {
                ...prev,
                [column]: next
            };
        });
    };

    const clearFile = () => {
        setFile(null);
        setData([]);
        setColumns([]);
        setColumnTypes({});
    };

    return {
        file,
        data,
        columns,
        columnTypes,
        setData, // Expose setter to allow hydration
        setColumns, // Expose setter to allow hydration
        setColumnTypes, // Expose setter to allow hydration
        processFile,
        toggleColumnType,
        clearFile
    };
};
