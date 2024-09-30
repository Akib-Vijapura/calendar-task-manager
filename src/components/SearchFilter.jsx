import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

const SearchFilter = ({ searchTerm, onSearchChange, categoryFilter, onCategoryFilterChange, categories }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Search tasks"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SearchFilter;