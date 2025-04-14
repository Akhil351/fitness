import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

export default function ActivityForm({ onActivityAdded }) {
  // added onActivityAdded props
  const [activity, setActivity] = useState({
    type: "",
    duration: "", 
    caloriesBurned: "",
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitted Activity:", activity);
      if (onActivityAdded) {
        onActivityAdded();
      }
      setActivity({
        type: "",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Activity Type</InputLabel>
          <Select
            name="type"
            value={activity.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
            <MenuItem value="SWIMMING">Swimming</MenuItem>
            <MenuItem value="YOGA">Yoga</MenuItem>
            <MenuItem value="WALKING">WALKING</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Duration (Minutes)"
          type="number"
          sx={{ mb: 2 }}
          value={activity.duration}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          sx={{ mb: 2 }}
          value={activity.caloriesBurned}
          onChange={handleChange}
        />
        <Button variant="contained" type="submit">
          Add Activity
        </Button>
      </Box>
    </div>
  );
}
