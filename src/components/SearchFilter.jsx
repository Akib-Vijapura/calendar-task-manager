import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Grid, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchFilter = ({ searchTerm, onSearchChange, categoryFilter, onCategoryFilterChange, categories }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search tasks"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilter;