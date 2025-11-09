import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  alpha,
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { AnalysisResult, IncidentDetails, ImpactForecast, TeamBriefing, TrainingScenario } from '../types';
import { generateImpactForecast, generateTeamBriefing, generateTrainingScenario } from '../services/apiClient';

interface OperationsHubProps {
  analysisResult: AnalysisResult | null;
  incidentDetails: IncidentDetails | null;
}

const OperationsHub: React.FC<OperationsHubProps> = ({ analysisResult, incidentDetails }) => {
  const [forecast, setForecast] = useState<ImpactForecast | null>(null);
  const [briefing, setBriefing] = useState<TeamBriefing | null>(null);
  const [scenario, setScenario] = useState<TrainingScenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperationalData = async () => {
      if (!incidentDetails || !analysisResult) return;

      setIsLoading(true);
      setError(null);
      try {
        const [forecastData, briefingData, scenarioData] = await Promise.all([
          generateImpactForecast(incidentDetails),
          generateTeamBriefing(analysisResult),
          generateTrainingScenario(incidentDetails),
        ]);
        setForecast(forecastData);
        setBriefing(briefingData);
        setScenario(scenarioData);
      } catch (err) {
        console.error('[OperationsHub] Error fetching operational data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load operational data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperationalData();
  }, [analysisResult, incidentDetails]);

  if (!analysisResult || !incidentDetails) {
    return (
      <Alert severity="info">
        <Typography variant="h6">Operations Hub</Typography>
        Please report an incident on the "Situational Awareness" page first. Advanced operational tools will be available here once an analysis is generated.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Generating advanced operational intelligence...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6750A4 0%, #9A82DB 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Operations Hub
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label={incidentDetails.incidentType}
            color="primary"
            sx={{ fontWeight: 500, fontSize: '0.875rem' }}
          />
          <Chip
            label={incidentDetails.location}
            variant="outlined"
            sx={{ fontWeight: 500, fontSize: '0.875rem' }}
          />
          <Chip
            label={`Severity: ${incidentDetails.severity}`}
            color={
              incidentDetails.severity === 'Severe' || incidentDetails.severity === 'Catastrophic'
                ? 'error'
                : incidentDetails.severity === 'High'
                ? 'warning'
                : 'success'
            }
            sx={{ fontWeight: 500, fontSize: '0.875rem' }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #F9A825 0%, #FBC02D 100%)',
                  }}
                >
                  <TrackChangesIcon sx={{ color: 'white', fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Impact Forecast
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'warning.main', mb: 1.5 }}>
                  Short-Term (0-12h)
                </Typography>
                <List dense sx={{ pl: 0 }}>
                  {forecast?.shortTermImpacts.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'warning.dark', mb: 1.5 }}>
                  Long-Term (12-72h)
                </Typography>
                <List dense sx={{ pl: 0 }}>
                  {forecast?.longTermImpacts.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'warning.dark' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main', mb: 1.5 }}>
                  Community Lifelines
                </Typography>
                {forecast?.communityLifelines.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      mt: 1.5,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#F9A825', 0.08),
                      border: `1px solid ${alpha('#F9A825', 0.2)}`,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {item.lifeline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.impact}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'warning.dark' }}>
                      Mitigation: {item.mitigation}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #188038 0%, #34A853 100%)',
                  }}
                >
                  <GroupsIcon sx={{ color: 'white', fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Team Briefing
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main', mb: 1.5 }}>
                  Mission Statement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {briefing?.missionStatement}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main', mb: 1.5 }}>
                  Key Objectives
                </Typography>
                <List dense sx={{ pl: 0 }}>
                  {briefing?.keyObjectives.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main', mb: 1.5 }}>
                  Known Risks
                </Typography>
                <List dense sx={{ pl: 0 }}>
                  {briefing?.knownRisks.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'error.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.dark', mb: 1.5 }}>
                  Communications Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {briefing?.commsPlan}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #0B57D0 0%, #4285F4 100%)',
                  }}
                >
                  <AssignmentIcon sx={{ color: 'white', fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Training Scenario
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'info.main', mb: 1 }}>
                  {scenario?.scenarioTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scenario?.initialBriefing}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.main', mb: 1.5 }}>
                  Learning Objectives
                </Typography>
                <List dense sx={{ pl: 0 }}>
                  {scenario?.learningObjectives.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.dark', mb: 1.5 }}>
                  Timeline Injects
                </Typography>
                {scenario?.timelineInjects.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      mt: 1.5,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#0B57D0', 0.08),
                      border: `1px solid ${alpha('#0B57D0', 0.2)}`,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.main', mb: 0.5 }}>
                      {item.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.event}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'info.dark' }}>
                      Expected Action: {item.expectedAction}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperationsHub;
