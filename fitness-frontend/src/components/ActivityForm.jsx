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
import { addActivity } from "../services/api";

export default function ActivityForm({ onActivityAdded }) {
  const defaultActivity = {
    type: "",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  };

  const [activity, setActivity] = useState(defaultActivity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitted Activity:", activity);
      await addActivity(activity);
      if (onActivityAdded) {
        onActivityAdded();
      }
      setActivity(defaultActivity);
    } catch (error) {
      console.error("Failed to add activity:", error);
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
            <MenuItem value="WALKING">Walking</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="duration"
          fullWidth
          label="Duration (Minutes)"
          type="number"
          sx={{ mb: 2 }}
          value={activity.duration}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />

        <TextField
          name="caloriesBurned"
          fullWidth
          label="Calories Burned"
          type="number"
          sx={{ mb: 2 }}
          value={activity.caloriesBurned}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />

        <Button variant="contained" type="submit">
          Add Activity
        </Button>
      </Box>
    </div>
  );
}
