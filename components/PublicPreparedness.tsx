import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Avatar,
  TextField,
  Typography,
  Paper,
  alpha,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { sendPreparednessMessage } from '../services/apiClient';
import type { ChatMessage } from '../types';

const PublicPreparedness: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    const currentMessage = userInput;
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendPreparednessMessage(sessionId, currentMessage);
      setSessionId(response.sessionId);
      setMessages((prev) => [...prev, { sender: 'model', text: response.response }]);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      setMessages((prev) => prev.filter((msg) => msg.text !== userMessage.text));
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'What should be in a basic emergency kit?',
    'How do I create a family evacuation plan?',
    "What's the best way to prepare for a power outage?",
    'How to stay safe during a wildfire?',
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
          Public Preparedness Guide
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ask anything about emergency preparedness and get AI-powered guidance
        </Typography>
      </Box>

      <Card elevation={1} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, maxHeight: 'calc(100vh - 250px)' }}>
        <CardContent sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {messages.length === 0 ? (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #6750A4 0%, #9A82DB 100%)',
                    mb: 3,
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  Start the conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a question below or type your own
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {suggestedQuestions.map((q) => (
                  <Grid item xs={12} sm={6} key={q}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setUserInput(q)}
                      sx={{
                        py: 2,
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                      }}
                    >
                      {q}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    px: 0,
                    py: 1.5,
                  }}
                >
                  {msg.sender === 'model' && (
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 2,
                        width: 36,
                        height: 36,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      AI
                    </Avatar>
                  )}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: msg.sender === 'user' ? 'primary.main' : alpha('#6750A4', 0.08),
                      color: msg.sender === 'user' ? 'white' : 'text.primary',
                      maxWidth: '75%',
                      border: msg.sender === 'model' ? `1px solid ${alpha('#6750A4', 0.12)}` : 'none',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  {msg.sender === 'user' && (
                    <Avatar
                      sx={{
                        bgcolor: 'secondary.main',
                        ml: 2,
                        width: 36,
                        height: 36,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      You
                    </Avatar>
                  )}
                </ListItem>
              ))}
            </List>
          )}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start', alignItems: 'flex-start', px: 0, py: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  mr: 2,
                  width: 36,
                  height: 36,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                AI
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: alpha('#6750A4', 0.08),
                  border: `1px solid ${alpha('#6750A4', 0.12)}`,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={20} thickness={4} sx={{ mr: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Paper>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        {error && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          </Box>
        )}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 3,
            borderTop: `1px solid ${alpha('#6750A4', 0.12)}`,
            display: 'flex',
            gap: 1.5,
            bgcolor: alpha('#6750A4', 0.02),
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about creating a plan, building a kit, etc."
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || !userInput.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: alpha('#6750A4', 0.12),
                color: alpha('#6750A4', 0.38),
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default PublicPreparedness;
