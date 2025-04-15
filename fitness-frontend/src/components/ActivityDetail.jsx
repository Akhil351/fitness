import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getActivitiesById, getActivityDetail } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { ChevronLeft } from "lucide-react";
import { CircularProgress, Container, Grid } from "@mui/material";

export default function ActivityDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Make both API calls simultaneously
      const [detailResponse, activitiesResponse] = await Promise.all([
        getActivityDetail(id),
        getActivitiesById(id)
      ]);
      
      setActivity(activitiesResponse.data);
      setRecommendation(detailResponse.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch activity data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ChevronLeft />}
        onClick={() => window.history.back()}
        sx={{
          mb: 3,
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        Back to Activities
      </Button>

      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
            }}
          >
            Activity Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Type
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {activity.type}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {activity.duration} minutes
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Calories Burned
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {activity.caloriesBurned} kcal
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Date
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {new Date(activity.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {recommendation && (
        <Card
          sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.primary",
              }}
            >
              AI Recommendation
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Analysis
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  bgcolor: "action.selected",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                {recommendation.recommendation}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Improvements
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {recommendation?.improvements?.map((improvement, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography variant="body1">{improvement}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Suggestions
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {recommendation?.suggestions?.map((suggestion, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography variant="body1">{suggestion}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Safety Guidelines
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {recommendation?.safety?.map((safety, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography variant="body1">{safety}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}