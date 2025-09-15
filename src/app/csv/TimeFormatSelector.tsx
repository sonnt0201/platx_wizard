'use client'

import * as React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export type TimeFormat = "readable" | "timestamp";

interface TimeFormatSelectorProps {
  value: TimeFormat;
  onChange: (value: TimeFormat) => void;
}

export function TimeFormatSelector({ value, onChange }: TimeFormatSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as TimeFormat);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="time-format-label">Time Format</InputLabel>
      <Select
        labelId="time-format-label"
        id="time-format-selector"
        value={value}
        label="Time Format"
        onChange={handleChange}
      >
        <MenuItem value="readable">Readable</MenuItem>
        <MenuItem value="timestamp">Timestamp (milliseconds since the Unix epoch)</MenuItem>
        
      </Select>
    </FormControl>
  );
}
