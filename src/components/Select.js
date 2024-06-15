import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styles from './Select.module.css';
import { color } from 'chart.js/helpers';

export default function SelectLabels({ value, onChange }) {
    return (
        <div className={styles["container"]}>
            <FormControl>
                <Select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={styles["select"]}
                >
                    <MenuItem value="USER">Пользователь</MenuItem>
                    <MenuItem value="ADMIN">Администратор</MenuItem>
                </Select>
            </FormControl>
        </div> 
    );
}
