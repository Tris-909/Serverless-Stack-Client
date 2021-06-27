import { useState } from 'react';

export function useFormFields(initialState) {
    const [fields, setFieldsValues] = useState(initialState);

    return [
        fields,
        function(event) {
            setFieldsValues({
                ...fields,
                [event.target.id]: event.target.value,
            });
        }
    ];
}