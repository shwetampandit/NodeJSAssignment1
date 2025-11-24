const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      data: { error: err.message }
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate entry',
      data: {}
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      data: {}
    });
  }
  
  res.status(500).json({
    message: 'Internal server error',
    data: {}
  });
};

module.exports = errorHandler;

