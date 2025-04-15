import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Timer, Flame, Plus, Check } from "lucide-react";
import { useState } from "react";
import { addActivity } from "../services/api";

const activityTypes = [
  { value: "RUNNING", label: "Running", icon: "🏃‍♂️" },
  { value: "CYCLING", label: "Cycling", icon: "🚴‍♂️" },
  { value: "SWIMMING", label: "Swimming", icon: "🏊‍♂️" },
  { value: "YOGA", label: "Yoga", icon: "🧘‍♂️" },
  { value: "WALKING", label: "Walking", icon: "🚶‍♂️" },
];

export default function ActivityForm({ onActivityAdded }) {
  const theme = useTheme();
  const defaultActivity = {
    type: "",
    duration: "",
    caloriesBurned: "",
    date: new Date().toISOString().split("T")[0],
  };

  const [activity, setActivity] = useState(defaultActivity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addActivity(activity);
      setSuccess(true);
      onActivityAdded(); // Call the callback after successful submission
      setTimeout(() => {
        setActivity(defaultActivity);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to add activity:", error);
    } finally {
      setIsSubmitting(false);
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
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 5,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.background.paper} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Plus size={24} />
        Track New Activity
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel
                id="activity-type-label"
                required
                sx={{
                  color: "text.secondary",
                  minWidth: "200px",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                }}
              >
                Activity Type
              </InputLabel>
              <Select
                labelId="activity-type-label"
                name="type"
                value={activity.type}
                onChange={handleChange}
                required
                label="Activity Type"
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minHeight: "1.5rem",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: "1px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      marginTop: 1,
                      boxShadow: theme.shadows[4],
                      "& .MuiMenuItem-root": {
                        padding: "8px 16px",
                      },
                    },
                  },
                }}
              >
                {activityTypes.map((type) => (
                  <MenuItem
                    key={type.value}
                    value={type.value}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{type.icon}</span>
                    <Typography>{type.label}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="duration"
              label="Duration"
              type="number"
              fullWidth
              value={activity.duration}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Timer size={18} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      label="minutes"
                      size="small"
                      sx={{
                        bgcolor: theme.palette.action.selected,
                        color: theme.palette.text.secondary,
                        height: "24px",
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: "1px",
                  },
                },
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="caloriesBurned"
              label="Calories Burned"
              type="number"
              fullWidth
              value={activity.caloriesBurned}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Flame size={18} color="#f87171" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      label="kcal"
                      size="small"
                      sx={{
                        bgcolor: theme.palette.action.selected,
                        color: theme.palette.text.secondary,
                        height: "24px",
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: "1px",
                  },
                },
              }}
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting || success}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : success ? (
                <Check size={20} />
              ) : (
                <Plus size={20} />
              )
            }
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
              textTransform: "none",
              minWidth: 150,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[6],
              },
              ...(success && {
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
              }),
            }}
          >
            {isSubmitting ? "Saving..." : success ? "Success!" : "Add Activity"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}