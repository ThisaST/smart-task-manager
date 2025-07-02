#!/usr/bin/env node

/**
 * Health check script for Docker container
 * This script is used by Docker's HEALTHCHECK instruction
 */

import http from 'http';

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/health',
  timeout: 2000,
  method: 'GET'
};

const healthCheck = () => {
  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('Health check passed');
      process.exit(0);
    } else {
      console.log(`Health check failed with status code: ${res.statusCode}`);
      process.exit(1);
    }
  });

  req.on('error', (err) => {
    console.log(`Health check failed: ${err.message}`);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('Health check timeout');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

healthCheck(); 