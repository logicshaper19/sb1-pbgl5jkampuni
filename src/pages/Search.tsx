import { useState, useCallback } from 'react';
import { Box, Container, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { CompanyCard } from '../components/CompanyCard';
import { searchCompanies, type Company, type APIError } from '../api/companies';
import { debounce } from '../utils/debounce';

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchCompanies(query);
      setCompanies(results);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError.message || 'An unexpected error occurred');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
    [performSearch]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Companies
        </Typography>
        
        <TextField
          fullWidth
          label="Search by company name, registration number, or director"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 4 }}
          disabled={loading}
          error={!!error}
          helperText={error || ' '}
        />

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && companies.length > 0 && (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </Box>
        )}

        {!loading && searchTerm.length >= 2 && companies.length === 0 && !error && (
          <Alert severity="info">
            No companies found matching your search criteria
          </Alert>
        )}
      </Box>
    </Container>
  );
}