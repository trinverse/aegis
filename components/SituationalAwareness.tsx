import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  alpha
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import type { View } from '../App';
import type { AnalysisResult, IncidentDetails } from '../types';
import { getIncidentAnalysis } from '../services/apiClient';

const incidentTypes = ['Natural Disaster', 'Technological Accident', 'Terrorism', 'Public Health Emergency', 'Other'];
const severityLevels = ['Low', 'Moderate', 'High', 'Severe', 'Catastrophic'];

interface SituationalAwarenessProps {
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIncidentDetails: (details: IncidentDetails | null) => void;
  setCurrentView: (view: View) => void;
}

const SituationalAwareness: React.FC<SituationalAwarenessProps> = ({ setAnalysisResult, setIncidentDetails, setCurrentView }) => {
  const [incidentType, setIncidentType] = useState<string>(incidentTypes[0]);
  const [location, setLocation] = useState<string>('');
  const [severity, setSeverity] = useState<string>(severityLevels[2]);
  const [description, setDescription] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) {
      setError('Location and Description are required.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setAnalysisResult(null);
    setIncidentDetails(null);

    try {
      const details: IncidentDetails = { incidentType, location, severity, description };
      const result = await getIncidentAnalysis(details);
      setAnalysis(result);
      setAnalysisResult(result);
      setIncidentDetails(details);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

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
            mb: 1,
          }}
        >
          Situational Awareness
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit an incident report to receive AI-powered analysis and recommendations
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Left Column - Incident Report Form */}
        <Box sx={{ flex: '0 0 41.666%' }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <AutoAwesome sx={{ color: 'white', fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  Incident Report
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="incident-type-label">Incident Type</InputLabel>
                  <Select
                    labelId="incident-type-label"
                    id="incidentType"
                    value={incidentType}
                    label="Incident Type"
                    onChange={(e) => setIncidentType(e.target.value)}
                  >
                    {incidentTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="location"
                  label="Location"
                  name="location"
                  autoComplete="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Downtown Metro Area, Sector 7G"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="severity-level-label">Severity Level</InputLabel>
                  <Select
                    labelId="severity-level-label"
                    id="severity"
                    value={severity}
                    label="Severity Level"
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    {severityLevels.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  id="description"
                  multiline
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of the situation..."
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 1 }}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                >
                  {isLoading ? 'Analyzing...' : 'Generate AI Analysis'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - AI Analysis Results */}
        <Box sx={{ flex: '0 0 58.333%' }}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
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
                  <AutoAwesome sx={{ color: 'white', fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  AI-Powered Analysis
                </Typography>
              </Box>

              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: 400 }}>
                  <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
                  <Typography sx={{ mt: 3, color: 'text.secondary' }}>Processing incident data...</Typography>
                </Box>
              )}
              {analysis && (
                <Box>
                  <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        variant="outlined"
                        onClick={() => setCurrentView('operations')}
                        sx={{ borderRadius: 100 }}
                      >
                        Go to Operations Hub
                      </Button>
                    }
                  >
                    Analysis Complete. Advanced tools are now available.
                  </Alert>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                      Summary
                    </Typography>
                    <Typography paragraph color="text.secondary">{analysis.summary}</Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                      Recommended Actions
                    </Typography>
                    <List dense>
                      {analysis.recommendedActions.map((action, i) => (
                        <ListItem key={i} sx={{ pl: 0 }}>
                          <Typography variant="body2" color="text.secondary">• {action}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>
                      Potential Risks
                    </Typography>
                    <List dense>
                      {analysis.potentialRisks.map((risk, i) => (
                        <ListItem key={i} sx={{ pl: 0 }}>
                          <Typography variant="body2" color="text.secondary">• {risk}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'info.main', mb: 1 }}>
                      Resource Suggestions
                    </Typography>
                    <List dense>
                      {analysis.resourceSuggestions.map((resource, i) => (
                        <ListItem key={i} sx={{ pl: 0 }}>
                          <Typography variant="body2" color="text.secondary">• {resource}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
              {!isLoading && !analysis && (
                <Box sx={{ textAlign: 'center', py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: 4,
                      bgcolor: alpha('#6750A4', 0.08),
                      mb: 3,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2, color: 'text.primary', fontWeight: 500 }}>
                    Analysis will appear here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Fill out the incident report to get started
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default SituationalAwareness;