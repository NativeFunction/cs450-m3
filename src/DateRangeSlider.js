import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function DateRangeSlider({ startDate, endDate, onChange }) {
  const defaultStart = startDate ? startDate.getTime() : new Date(1970, 0, 1).getTime();
  const defaultEnd = endDate ? endDate.getTime() : new Date(2070, 0, 1).getTime();

  const [value, setValue] = useState([defaultStart, defaultEnd]);

  useEffect(() => {
    setValue([defaultStart, defaultEnd]);
  }, [startDate, endDate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange([new Date(newValue[0]), new Date(newValue[1])]);
  };

  return (
    <Box width={300} marginLeft={2}>
      <Typography gutterBottom>Date Range</Typography>
      <Slider
        value={value}
        onChange={handleChange}
        min={new Date(2012, 0, 1).getTime()}
        max={new Date(2025, 11, 31).getTime()}
        step={24 * 60 * 60 * 1000}
        valueLabelDisplay="auto"
        valueLabelFormat={(val) => new Date(val).toLocaleDateString()}
      />
    </Box>
  );
}

export default DateRangeSlider;
