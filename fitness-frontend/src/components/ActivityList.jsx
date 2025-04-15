import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Divider,
  useTheme
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { Timer, Flame, ChevronRight } from "lucide-react";

export default function ActivityList({ activities }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const getActivityIcon = (type) => {
    switch (type) {
      case "RUNNING":
        return "🏃‍♂️";
      case "CYCLING":
        return "🚴‍♂️";
      case "SWIMMING":
        return "🏊‍♂️";
      case "YOGA":
        return "🧘‍♂️";
      case "WALKING":
        return "🚶‍♂️";
      default:
        return "💪";
    }
  };

  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid item xs={12} sm={6} md={4} key={activity.id}>
          <Card
            onClick={() => navigate(`/activities/${activity.id}`)}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[8],
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h4">{getActivityIcon(activity.type)}</Typography>
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    {activity.type}
                  </Typography>
                </Box>
                <ChevronRight size={20} style={{ color: theme.palette.text.secondary }} />
              </Box>

              <Box display="flex" justifyContent="space-between" color="text.secondary">
                <Box display="flex" alignItems="center" gap={1}>
                  <Timer size={18} color={theme.palette.text.secondary} />
                  <Typography variant="body2">{activity.duration} mins</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Flame size={18} color="#f87171" />
                  <Typography variant="body2">{activity.caloriesBurned} cal</Typography>
                </Box>
              </Box>
            </CardContent>

            <Box
              sx={{
                height: "6px",
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}