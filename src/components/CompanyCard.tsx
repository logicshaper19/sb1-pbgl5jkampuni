import { Card, CardContent, Typography, Box } from '@mui/material';
import type { Company } from '../api/companies';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {company.name}
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Registration: {company.registrationNumber}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Date Registered: {new Date(company.dateRegistered).toLocaleDateString()}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Directors: {company.directors.map(d => d.name).join(', ')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Address: {company.address.street}, {company.address.building}
          </Typography>

          {company.contactInfo.phone && (
            <Typography variant="body2" color="text.secondary">
              Phone: {company.contactInfo.phone}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}