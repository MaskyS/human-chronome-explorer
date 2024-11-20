// src/components/DataValidator.tsx
import { useEffect, useState } from 'react';
import { ValidationSummary, validateAllData } from '../utils/dataValidator';
import { useData } from '../context/DataContext';

export function DataValidator() {
    const { data } = useData();
    const [validation, setValidation] = useState<ValidationSummary | null>(null);
    const [rawFiles, setRawFiles] = useState<Record<string, string>>({});

    useEffect(() => {
        // Load all raw CSV files
        Promise.all([
            fetch('/src/data/all_countries.csv').then(r => r.text()),
            fetch('/src/data/global_human_day.csv').then(r => r.text()),
            fetch('/src/data/global_economic_activity.csv').then(r => r.text())
        ]).then(([countries, global, economic]) => {
            setRawFiles({
                'all_countries.csv': countries,
                'global_human_day.csv': global,
                'global_economic_activity.csv': economic
            });
        });
    }, []);

    useEffect(() => {
        if (Object.keys(rawFiles).length > 0 && data) {
            const result = validateAllData(rawFiles, data);
            setValidation(result);
        }
    }, [rawFiles, data]);

    if (!validation) return <div>Validating data...</div>;

    return (
        <div className="p-4">
            <h2>Data Validation Results</h2>
            <div className="mb-4">
                <h3>Files Checked: {validation.filesChecked.length}</h3>
                <p>Overall Status: {validation.allValid ? '✅ All Valid' : '❌ Issues Found'}</p>
            </div>
            
            {Object.entries(validation.results).map(([filename, result]) => (
                <div 
                    key={filename} 
                    className={`p-2 mb-2 ${result.isValid ? 'bg-green-100' : 'bg-red-100'}`}
                >
                    <h4>{filename}</h4>
                    <pre>{result.summary}</pre>
                    
                    {result.missingSubcategories.length > 0 && (
                        <>
                            <h5>Missing Subcategories:</h5>
                            <ul>
                                {result.missingSubcategories.map(sub => (
                                    <li key={sub}>{sub}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {result.invalidValues.length > 0 && (
                        <>
                            <h5>Invalid Values:</h5>
                            <ul>
                                {result.invalidValues.map(({ field, count, examples }) => (
                                    <li key={field}>
                                        {field}: {count} issues
                                        <br />
                                        Examples: {examples.join(', ')}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}